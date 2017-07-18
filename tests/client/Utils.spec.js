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
    it('should exist', () => {
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
    it('should exist', () => {
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

});
