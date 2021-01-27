import { Result, ResultAsync } from "@interfaces/objects";
import { err, ok } from "neverthrow";

export class ResultUtils {
    static combine<T, E>(asyncResultList: ResultAsync<T, E>[]): ResultAsync<T[],E> {
        return ResultAsync.fromPromise(Promise.all(asyncResultList), 
        (e) => {return e as E})
        .andThen(ResultUtils.combineResultList);
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
    };
}