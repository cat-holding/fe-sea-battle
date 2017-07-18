import Utils from './../../client/Utils';

describe('Utils', () => {
  it('should exist', () => {
    expect(Utils).toBeDefined();
    expect(typeof (Utils.isNaturalNumberOrZero)).toBe('function');
    expect(typeof (Utils.isNull)).toBe('function');
    expect(typeof (Utils.isCorrectCoordinate)).toBe('function');
    expect(typeof (Utils.isCorrectCoordinates)).toBe('function');
    expect(typeof (Utils.createArray)).toBe('function');
  });

  describe('#isNaturalNumberOrZero()', () => {
    it('Will check the variable', () => {
      expect(Utils.isNaturalNumberOrZero(0)).toBeTruthy();
      expect(Utils.isNaturalNumberOrZero(1)).toBeTruthy();
      expect(Utils.isNaturalNumberOrZero(Infinity)).toBeFalsy();
      expect(Utils.isNaturalNumberOrZero(-1)).toBeFalsy();
      expect(Utils.isNaturalNumberOrZero(0.4)).toBeFalsy();
      expect(Utils.isNaturalNumberOrZero('2')).toBeFalsy();
      expect(Utils.isNaturalNumberOrZero('-2')).toBeFalsy();
      expect(Utils.isNaturalNumberOrZero(-2.5)).toBeFalsy();
    });
  });
});
