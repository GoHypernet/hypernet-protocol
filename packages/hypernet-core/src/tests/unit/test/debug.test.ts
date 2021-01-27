import td from "testdouble";
import { okAsync, ResultAsync, combine, ok, err, Result} from "neverthrow";
import { ResultUtils } from "@implementations/utilities";

interface ITestInterface {
    getName(): string;
    setName(name: string): void;
    getAsyncResult(): ResultAsync<ITestInterface, Error>;
}

class TestClass {
    public testVal = "Beep";

    public getAsyncResult(): ResultAsync<TestClass, Error> {
        return okAsync(this);
    }
}

describe("Debugging and basic info tests", () => {
  test("TestDouble mock returns directly", async () => {
    // Arrange
    const mock = td.object<ITestInterface>();

    const func = () => {return mock;}

    // Act
    const returnMock = func();

    // Assert
    expect(returnMock).toBeDefined();
    expect(returnMock).toBe(returnMock);
  });

  test("TestDouble mock returns from resultAsync", async () => {
    // Arrange
    const mock = td.object<ITestInterface>();
    const mock2 = td.object<ITestInterface>();

    td.when(mock.getAsyncResult()).thenReturn(okAsync<ITestInterface, Error>(mock2));

    // Act
    const result= await mock.getAsyncResult().map((val) => {
        val.setName("Phoebe");
        return val;
    });
    

    // Assert
    expect(result).toBeDefined();
    const resultVal = result._unsafeUnwrap();
    expect(resultVal).toBe(mock2);
    td.verify(mock2.setName("Phoebe"));
  });

  test("combine works as expected", async () => {
    // Arrange
    const tc1 = new TestClass();
    const tc2 = new TestClass();

    // Act
    const result = await combine([tc1.getAsyncResult(), tc2.getAsyncResult()]).map((vals) => {
        const [tc1Res, tc2Res] = vals;

        expect(tc1Res).toBe(tc1);
        expect(tc2Res).toBe(tc2);

        return "Phoebe";
    });

    // Assert
    expect(result).toBeDefined();
    expect(result._unsafeUnwrap()).toBe("Phoebe");
  });

  test("combine works with anonymous objects", async () => {
    // Arrange
    const anon1 = {foo: () => {}};

    // Act
    const result = await combine([okAsync(anon1)]).map((vals) => {
        const [anon1Res] = vals;

        expect(anon1Res).toBe(anon1);

        return "Phoebe";
    });

    // Assert
    expect(result).toBeDefined();
    expect(result._unsafeUnwrap()).toBe("Phoebe");
  });

  test("combine works with TestDouble mocks of interfaces", async () => {
    // Arrange
    const mock = td.object<ITestInterface>();

    // Act
    const result = await combine([okAsync(mock)]);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const unwrappedResult = result._unsafeUnwrap();
    expect(unwrappedResult.length).toBe(0);
    expect(unwrappedResult[0]).toBeUndefined();
  });

  test("ResultUtils.combine works with TestDouble mocks of interfaces", async () => {
    // Arrange
    const mock = td.object<ITestInterface>();

    // Act
    const result = await ResultUtils.combine([okAsync(mock)]);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const unwrappedResult = result._unsafeUnwrap();
    expect(unwrappedResult.length).toBe(1);
    expect(unwrappedResult[0]).toBe(mock);
  });

  test("TestDouble mocks and concrete classes work with combine", async () => {
    // Arrange
    const mock = td.object<ITestInterface>();
    const tc = new TestClass();

    // Act
    const result = await combine([okAsync(mock), okAsync(tc) as ResultAsync<any, any>])
    .map((vals) => {
        const [tcVal, mockVal] = vals;

        expect(tcVal).toBe(tc);
        expect(mockVal).toBeUndefined();
    });

    // Assert
    expect(result).toBeDefined();
  });

  test("TestDouble mocks and concrete classes work with ResultUtils.combine", async () => {
    // Arrange
    const mock = td.object<ITestInterface>();
    const mock2 = td.object<ITestInterface>();
    const tc = new TestClass();

    td.when(mock.getAsyncResult()).thenReturn(okAsync(mock2));

    // Act
    const result = await ResultUtils.combine([okAsync(mock), okAsync(tc) as ResultAsync<any, any>]).andThen((vals) => {
        const [mockVal, tcVal] = vals;

        expect(tcVal).toBe(tc);
        expect(mockVal).toBe(mock);
        
        return mockVal.getAsyncResult()
    })
    .map((mock2Val) => {
        expect(mock2Val).toBe(mock2);
        return mock2Val;
    });

    // Assert
    expect(result).toBeDefined();
    expect(result._unsafeUnwrap()).toBe(mock2);
  });

  test("TestDouble mocks work with combine via mocks", async () => {
    // Arrange
    const mock = td.object<ITestInterface>();
    const mock2 = td.object<ITestInterface>();
    const mock3 = td.object<ITestInterface>();
    const mock4 = td.object<ITestInterface>();
    const mock5 = td.object<ITestInterface>();

    td.when(mock.getAsyncResult()).thenReturn(okAsync(mock2));
    td.when(mock3.getAsyncResult()).thenReturn(okAsync(mock4));
    td.when(mock2.getAsyncResult()).thenReturn(okAsync(mock5));

    // Act
    const result = await combine([mock.getAsyncResult(), mock3.getAsyncResult()])
    .map((vals) => {
        const [mock2Val, mock4Val] = vals;

        expect(mock2Val).toBeUndefined();
        expect(mock4Val).toBeUndefined();
    });

    // Assert
    expect(result).toBeDefined();
  });

  test("TestDouble mocks work with ResultUtils.combine via mocks", async () => {
    // Arrange
    const mock = td.object<ITestInterface>();
    const mock2 = td.object<ITestInterface>();
    const mock3 = td.object<ITestInterface>();
    const mock4 = td.object<ITestInterface>();
    const mock5 = td.object<ITestInterface>();

    td.when(mock.getAsyncResult()).thenReturn(okAsync(mock2));
    td.when(mock3.getAsyncResult()).thenReturn(okAsync(mock4));
    td.when(mock2.getAsyncResult()).thenReturn(okAsync(mock5));

    // Act
    const result = await ResultUtils.combine([mock.getAsyncResult(), mock3.getAsyncResult()]).andThen((vals) => {
        const [mock2Val, mock4Val] = vals;

        expect(mock2Val).toBe(mock2);
        expect(mock4Val).toBe(mock4);

        return mock2Val.getAsyncResult()
    })
    .map((mock5Val) => {
        expect(mock5Val).toBe(mock5);
        return mock5Val;
    });

    // Assert
    expect(result).toBeDefined();
    expect(result._unsafeUnwrap()).toBe(mock5);
  });

  test("Promise.all works with TestDouble mocks and ResultAsync", async () => {
    // Arrange
    const mock = td.object<ITestInterface>();

    // Act
    const result = await Promise.all([okAsync(mock)]);
    
    // Assert
    expect(result).toBeDefined();
    expect(result[0].isErr()).toBeFalsy();
    expect(result[0]._unsafeUnwrap()).toBe(mock);
  });
});
