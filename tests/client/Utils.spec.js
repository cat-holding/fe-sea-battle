import Utils from './../../client/Utils';

describe('Utils', () => {
  it('should exist', () => {
    const funcs = [
      Utils.isNaturalNumberOrZero,
      Utils.isNull,
      Utils.isCorrectCoordinate,
      Utils.isCorrectCoordinates,
      Utils.createArray,
    ];

    expect(Utils).toBeDefined();
    expect(funcs.map(el => typeof el === 'function')).not.toContain(false);
  });

  describe('#isNaturalNumberOrZero()', () => {
    it('Will check the variable', () => {
      [0, 1].forEach((i) => {
        expect(Utils.isNaturalNumberOrZero(i)).toBeTruthy();
      });
      [Infinity, -1, 0.4, '2', '-2', -2.5, null, NaN, undefined].forEach((i) => {
        expect(Utils.isNaturalNumberOrZero(i)).toBeFalsy();
      });
    });
  });

  describe('#isNull()', () => {
    it('Will check the variable', () => {
      expect(Utils.isNull(null)).toBeTruthy();
      [Infinity, -1, 0.4, '2', '-2', -2.5, NaN, undefined, '', 0].forEach((i) => {
        expect(Utils.isNull(i)).toBeFalsy();
      });
    });
  });

  describe('#isObject()', () => {
    it('all dependencies exist', () => {
      expect(typeof Utils.isNull).toBe('function');
    });

    it('Will check the variable', () => {
      expect(Utils.isObject({})).toBeTruthy();

      [Infinity, -1, 0.4, '2', '-2', -2.5, NaN, undefined, '', 0, null, []].forEach((i) => {
        expect(Utils.isObject(i)).toBeFalsy();
      });
    });
  });

  describe('#isCorrectCoordinate()', () => {
    it('all dependencies exist', () => {
      expect(typeof Utils.isNaturalNumberOrZero).toBe('function');
    });

    it('Will check the variable', () => {
      expect(Utils.isCorrectCoordinate(0, 0)).toBeFalsy();
      expect(Utils.isCorrectCoordinate(0, -10)).toBeFalsy();
      expect(Utils.isCorrectCoordinate(0.5, -10)).toBeFalsy();
      expect(Utils.isCorrectCoordinate(0, 1)).toBeTruthy();
      expect(Utils.isCorrectCoordinate(0, 4.3)).toBeTruthy();
    });
  });

  describe('#isCorrectCoordinates()', () => {
    it('all dependencies exist', () => {
      expect(typeof Utils.isCorrectCoordinate).toBe('function');
    });

    it('Will check the coordinates', () => {
      expect(Utils.isCorrectCoordinates(0, -1, 1)).toBeFalsy();
      expect(Utils.isCorrectCoordinates(0, 6, -10)).toBeFalsy();
      expect(Utils.isCorrectCoordinates(0.5, 2, -10)).toBeFalsy();
      expect(Utils.isCorrectCoordinates(0, 0, 1)).toBeTruthy();
      expect(Utils.isCorrectCoordinates(0, 3, 4.3)).toBeTruthy();
    });
  });

  describe('#createArray()', () => {
    it('all dependencies exist', () => {
      expect(typeof Utils.isNaturalNumberOrZero).toBe('function');
    });

    it('The default array will be created', () => {
      const arr = Utils.createArray();

      expect(arr).toBeArray();
      expect(arr).toBeArrayOfSize(1);
      expect(arr[0]).toBe(null);
    });

    it('Input variables are checked', () => {
      expect(() => { Utils.createArray(null, 0); }).toThrowError(/.*"columns".*/);
      expect(() => { Utils.createArray(null, -10); }).toThrowError(/.*"columns".*/);
      expect(() => { Utils.createArray(null, 1, 0.5); }).toThrowError(/.*"lines".*/);
    });

    it('A one-dimensional array will be created', () => {
      const arr = Utils.createArray(0, 5);

      expect(arr).toBeArray();
      expect(arr).toBeArrayOfSize(5);
      arr.forEach((el) => {
        expect(el).toBe(0);
      });
    });

    it('A two-dimensional array will be created', () => {
      const arr = Utils.createArray(7, 2, 3);

      expect(arr).toBeArray();
      expect(arr).toBeArrayOfSize(3);
      arr.forEach((arr2) => {
        expect(arr2).toBeArrayOfSize(2);
        arr2.forEach((el) => {
          expect(el).toBe(7);
        });
      });
    });
  });
});
