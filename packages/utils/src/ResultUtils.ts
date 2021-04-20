import { err, ok, ResultAsync, Result } from "neverthrow";

export class ResultUtils {
  static combine<T, T2, T3, T4, E, E2, E3, E4>(
    asyncResultList: [ResultAsync<T, E>, ResultAsync<T2, E2>, ResultAsync<T3, E3>, ResultAsync<T4, E4>],
  ): ResultAsync<[T, T2, T3, T4], E | E2 | E3 | E4>;
  static combine<T, T2, T3, E, E2, E3>(
    asyncResultList: [ResultAsync<T, E>, ResultAsync<T2, E2>, ResultAsync<T3, E3>],
  ): ResultAsync<[T, T2, T3], E | E2 | E3>;
  static combine<T, T2, E, E2>(asyncResultList: [ResultAsync<T, E>, ResultAsync<T2, E2>]): ResultAsync<[T, T2], E | E2>;
  static combine<T, E>(asyncResultList: ResultAsync<T, E>[]): ResultAsync<T[], E>;
  static combine<T, E>(asyncResultList: ResultAsync<T, E>[]): ResultAsync<T[], E> {
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

  static executeSerially<T, E>(funcList: (() => ResultAsync<T, E>)[]): ResultAsync<T[], E> {
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
}
