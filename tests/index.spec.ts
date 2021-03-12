import 'mocha';
import { expect } from 'chai';
import { chachaBlock } from '../src/index';

describe('chachaBlock function test', () => {
  it('RFC\'s test', () => {
    const s: number[] = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574,
      0x03020100, 0x07060504, 0x0b0a0908, 0x0f0e0d0c,
      0x13121110, 0x17161514, 0x1b1a1918, 0x1f1e1d1c,
      0x00000001, 0x09000000, 0x4a000000, 0x00000000];
    expect(chachaBlock(s).toString()).
      // eslint-disable-next-line max-len
      to.deep.equal('3840405776,358169553,534581072,3295748259,3354710471,57196595,2594841092,1315755203,1180992210,162176775,98026004,2718075865,3516666549,3108902622,3900952779,1312575650');
  });
});
