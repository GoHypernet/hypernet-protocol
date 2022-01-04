import delay from "delay";
import { err, ok, ResultAsync, Result, okAsync, errAsync } from "neverthrow";
export class ResultUtils {
  static combine<
    T,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    T15,
    E,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8,
    E9,
    E10,
    E11,
    E12,
    E13,
    E14,
    E15,
  >(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
      ResultAsync<T7, E7>,
      ResultAsync<T8, E8>,
      ResultAsync<T9, E9>,
      ResultAsync<T10, E10>,
      ResultAsync<T11, E11>,
      ResultAsync<T12, E12>,
      ResultAsync<T13, E13>,
      ResultAsync<T14, E14>,
      ResultAsync<T15, E15>,
    ],
  ): ResultAsync<
    [T, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15],
    | E
    | E2
    | E3
    | E4
    | E5
    | E6
    | E7
    | E8
    | E9
    | E10
    | E11
    | E12
    | E13
    | E14
    | E15
  >;

  static combine<
    T,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    T14,
    E,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8,
    E9,
    E10,
    E11,
    E12,
    E13,
    E14,
  >(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
      ResultAsync<T7, E7>,
      ResultAsync<T8, E8>,
      ResultAsync<T9, E9>,
      ResultAsync<T10, E10>,
      ResultAsync<T11, E11>,
      ResultAsync<T12, E12>,
      ResultAsync<T13, E13>,
      ResultAsync<T14, E14>,
    ],
  ): ResultAsync<
    [T, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14],
    E | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 | E11 | E12 | E13 | E14
  >;

  static combine<
    T,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    T13,
    E,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8,
    E9,
    E10,
    E11,
    E12,
    E13,
  >(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
      ResultAsync<T7, E7>,
      ResultAsync<T8, E8>,
      ResultAsync<T9, E9>,
      ResultAsync<T10, E10>,
      ResultAsync<T11, E11>,
      ResultAsync<T12, E12>,
      ResultAsync<T13, E13>,
    ],
  ): ResultAsync<
    [T, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13],
    E | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 | E11 | E12 | E13
  >;

  static combine<
    T,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    T12,
    E,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8,
    E9,
    E10,
    E11,
    E12,
  >(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
      ResultAsync<T7, E7>,
      ResultAsync<T8, E8>,
      ResultAsync<T9, E9>,
      ResultAsync<T10, E10>,
      ResultAsync<T11, E11>,
      ResultAsync<T12, E12>,
    ],
  ): ResultAsync<
    [T, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12],
    E | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 | E11 | E12
  >;

  static combine<
    T,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    T11,
    E,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8,
    E9,
    E10,
    E11,
  >(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
      ResultAsync<T7, E7>,
      ResultAsync<T8, E8>,
      ResultAsync<T9, E9>,
      ResultAsync<T10, E10>,
      ResultAsync<T11, E11>,
    ],
  ): ResultAsync<
    [T, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11],
    E | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10 | E11
  >;

  static combine<
    T,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    T10,
    E,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8,
    E9,
    E10,
  >(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
      ResultAsync<T7, E7>,
      ResultAsync<T8, E8>,
      ResultAsync<T9, E9>,
      ResultAsync<T10, E10>,
    ],
  ): ResultAsync<
    [T, T2, T3, T4, T5, T6, T7, T8, T9, T10],
    E | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9 | E10
  >;

  static combine<
    T,
    T2,
    T3,
    T4,
    T5,
    T6,
    T7,
    T8,
    T9,
    E,
    E2,
    E3,
    E4,
    E5,
    E6,
    E7,
    E8,
    E9,
  >(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
      ResultAsync<T7, E7>,
      ResultAsync<T8, E8>,
      ResultAsync<T9, E9>,
    ],
  ): ResultAsync<
    [T, T2, T3, T4, T5, T6, T7, T8, T9],
    E | E2 | E3 | E4 | E5 | E6 | E7 | E8 | E9
  >;

  static combine<T, T2, T3, T4, T5, T6, T7, T8, E, E2, E3, E4, E5, E6, E7, E8>(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
      ResultAsync<T7, E7>,
      ResultAsync<T8, E8>,
    ],
  ): ResultAsync<
    [T, T2, T3, T4, T5, T6, T7, T8],
    E | E2 | E3 | E4 | E5 | E6 | E7 | E8
  >;

  static combine<T, T2, T3, T4, T5, T6, T7, E, E2, E3, E4, E5, E6, E7>(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
      ResultAsync<T7, E7>,
    ],
  ): ResultAsync<[T, T2, T3, T4, T5, T6, T7], E | E2 | E3 | E4 | E5 | E6 | E7>;
  static combine<T, T2, T3, T4, T5, T6, E, E2, E3, E4, E5, E6>(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
      ResultAsync<T6, E6>,
    ],
  ): ResultAsync<[T, T2, T3, T4, T5, T6], E | E2 | E3 | E4 | E5 | E6>;
  static combine<T, T2, T3, T4, T5, E, E2, E3, E4, E5>(
    asyncResultList: [
      ResultAsync<T, E>,
      ResultAsync<T2, E2>,
      ResultAsync<T3, E3>,
      ResultAsync<T4, E4>,
      ResultAsync<T5, E5>,
    ],
  ): ResultAsync<[T, T2, T3, T4, T5], E | E2 | E3 | E4 | E5>;
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

  static race<T, E>(asyncResultList: ResultAsync<T, E>[]): ResultAsync<T, E> {
    return ResultAsync.fromPromise(Promise.race(asyncResultList), (e) => {
      return e as E;
    }).andThen(ResultUtils.resultRace);
  }

  static resultRace<T, E>(result: Result<T, E>): Result<T, E> {
    return result.isErr() ? err(result.error) : ok(result.value);
  }

  static fromThrowableResult<T, E>(throwableCallback: () => T): Result<T, E> {
    const throwable = Result.fromThrowable(throwableCallback, (err) => {
      return err as E;
    });
    return throwable();
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

  /**
   * filter() is a normal filter method that works with async callbacks.
   * This works like a nomral array filter() call, except the callback returns
   * a ResultAsync<boolean> instead of just boolean.
   * @param arr the source array
   * @param callback a function that returns a ResultAsync<boolean>; if it returns true then the source value is included in the result.
   * @returns a ResultAsync containing an array of source values where the callback returns true.
   */
  static filter<T, E extends Error>(
    arr: T[],
    callback: (val: T) => ResultAsync<boolean, E>,
  ): ResultAsync<T[], E> {
    const filterVals = new Array<T>();

    return ResultUtils.combine(
      arr.map((val) => {
        return callback(val).map((result) => {
          if (result) {
            filterVals.push(val);
          }
        });
      }),
    ).map(() => {
      return filterVals;
    });
  }

  /**
   * map() is a way to combine multiple async callbacks.
   * This works like a normal array map() call, except the callbacks return ResultAsync.
   * It will combine all the results and return a single ResultAsync with an array of the mapped
   * values.
   * @param arr The source array of objects
   * @param callback A function that returns a ResultAsync and a value
   * @returns A ResultAsync containing an array of the mapped values or the first error.
   */
  static map<T, U, E extends Error>(
    arr: T[],
    callback: (val: T) => ResultAsync<U, E>,
  ): ResultAsync<U[], E> {
    const mapVals = new Array<U>();

    return ResultUtils.combine(
      arr.map((val) => {
        return callback(val).map((result) => {
          mapVals.push(result);
        });
      }),
    ).map(() => {
      return mapVals;
    });
  }

  static delay(ms: number): ResultAsync<void, never> {
    return ResultAsync.fromSafePromise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      }),
    );
  }
}
