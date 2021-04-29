import delay from "delay";
import { err, ok, ResultAsync, Result, okAsync, errAsync } from "neverthrow";

export class ResultUtils {
  static combine<T, T2, T3, T4, E, E2, E3, E4>(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
    ],
  ): ResultAsync<[T, T2, T3, T4], E | E2 | E3 | E4>;
  static combine<T, T2, T3, E, E2, E3>(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
    ],
  ): ResultAsync<[T, T2, T3], E | E2 | E3>;
  static combine<T, T2, E, E2>(
    asyncResultList: [ResultAsync<T, E>, ResultAsync<T2, E2>],
  ): ResultAsync<[T, T2], E | E2>;
  static combine<T, E>(
    asyncResultList: ResultAsync<T, E>[],
  ): ResultAsync<T[], E>;
  static combine<T, E>(
    asyncResultList: ResultAsync<T, E>[],
  ): ResultAsync<T[], E> {
    return ResultAsync.fromPromise(Promise.all(asyncResultList), (e) => {
      return e as E;
    }).andThen(ResultUtils.combineResultList);
  }

  static combineResultList<T, E>(resultList: Result<T, E>[]): Result<T[], E> {
    return resultList.reduce((acc: Result<T[], E>, result) => {
      return acc.isOk()
        ? result.isErr()
          ? err(result.error)
          : acc.map((values) => {
              values.push(result.value);
              return values;
            })
        : acc;
    }, ok([]));
  }

  static executeSerially<T, E>(
    funcList: (() => ResultAsync<T, E>)[],
  ): ResultAsync<T[], E> {
    // const results = new Array<T>();

    // // for (const func of funcList) {
    // //   func().map((val) => {})
    // // }

    // try {
    //   funcList.reduce(
    //     (p: ResultAsync<void, E>, x) =>
    //       p.andThen(_ => {
    //         return x()
    //           .map((result) => {
    //             results.push(result);
    //           })
    //           .mapErr((e) => {
    //             throw e;
    //           });
    //       }),
    //     okAsync<void, E>(undefined)
    //   );
    // }
    // catch (e) {
    //   return errAsync(e);
    // }

    const func = async () => {
      const results = new Array<T>();
      for (const func of funcList) {
        const result = await func();
        if (result.isErr()) {
          throw result.error;
        } else {
          results.push(result.value);
        }
      }
      return results;
    };

    return ResultAsync.fromPromise(func(), (e) => {
      return e as E;
    });
  }

  static backoffAndRetry<T, E extends Error>(
    func: () => ResultAsync<T, E>,
    acceptableErrors: Function[],
    maxAttempts?: number,
    baseSeconds = 5,
  ): ResultAsync<T, E> {
    if (maxAttempts != null && maxAttempts < 1) {
      throw new Error("maxAttempts must be 1 or more!");
    }

    if (baseSeconds < 1) {
      throw new Error("baseSeconds must be 1 or more!");
    }

    const runAndCheck = (
      currentAttempt: number,
      nextAttemptSecs: number,
      lastError: E | null,
    ): ResultAsync<T, E> => {
      if (maxAttempts != null && currentAttempt > maxAttempts) {
        if (lastError == null) {
          throw new Error(
            "Error before first function run; logical error! maxAttempts must be 1 or more!",
          );
        }
        return errAsync(lastError);
      }

      // Check the result. If it's not an error, we're done!
      // If it's an error, check the error type against acceptableErrors. If it's in the list,
      // wait some amount of time and try again.
      // If it is not in the list, return the error and stop.
      return func().orElse((e) => {
        let retry = false;
        for (const acceptableError of acceptableErrors) {
          if (e instanceof acceptableError) {
            retry = true;
            break;
          }
        }
        if (retry) {
          return ResultAsync.fromSafePromise<void, never>(
            delay(nextAttemptSecs),
          ).andThen(() => {
            return runAndCheck(++currentAttempt, nextAttemptSecs * 2, e);
          });
        }
        return errAsync(e);
      });
    };

    return runAndCheck(1, baseSeconds, null);
  }
}
