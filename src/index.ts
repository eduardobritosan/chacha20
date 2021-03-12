/**
 * Object used in order to save the changes to the numbers in a JS function
 */
export type NumObject = {
  value: number;
}

/**
 * Binary bitwise rotation to the left (circular shift)
 * @param a The bits to be rotated
 * @param b The count
 * @returns The resulting rotated bits
 */
export function rotl(value: number, count: number): number {
  const array: Uint32Array = new Uint32Array(4);
  array[0] = value;
  array[1] = count;
  array[2] = array[0] << array[1];
  array[3] = array[0] >>> (32 - array[1]);
  array[0] = array[2] | array[3];
  return array[0];
}

/**
 * ChaCha20 Quarter Round
 */
export function qR(a: NumObject, b: NumObject,
  c: NumObject, d: NumObject): void {
  const array: Uint32Array = new Uint32Array(10);
  array[0] = a.value;
  array[1] = b.value;
  array[2] = c.value;
  array[3] = d.value;

  array[0] = array[0] + array[1];
  array[3] = array[3] ^ array[0];
  array[3] = rotl(array[3], 16);

  array[2] = array[2] + array[3];
  array[1] = array[1] ^ array[2];
  array[1] = rotl(array[1], 12);

  array[0] = array[0] + array[1];
  array[3] = array[3] ^ array[0];
  array[3] = rotl(array[3], 8);

  array[2] = array[2] + array[3];
  array[1] = array[1] ^ array[2];
  array[1] = rotl(array[1], 7);

  a.value = array[0];
  b.value = array[1];
  c.value = array[2];
  d.value = array[3];
}

/**
 * Does a Quarter Round and saves its changes
 * @param arr Array to be modifed
 */
export function saveArrChange(arr: Uint32Array, a_: number,
  b_: number, c_: number, d_: number): void {
  const a = { value: arr[a_] };
  const b = { value: arr[b_] };
  const c = { value: arr[c_] };
  const d = { value: arr[d_] };

  qR(a, b, c, d);

  arr[a_] = a.value;
  arr[b_] = b.value;
  arr[c_] = c.value;
  arr[d_] = d.value;
};

/**
 * Prints the state in hex
 * @param state A 32 bit unsigned integer array
 * @param message The message to be displayed before printing the array in hex
 */
export function printState(state: Uint32Array, message: string): void {
  const u: string[] = [];
  state.forEach((val) => u.push(val.toString(16)));
  console.log(`${message}${u}\n`);
}

/**
 * ChaCha20 generator
 * @param input The initialized ChaCha20 block
 * @returns The keystream
 */
export function chachaBlock(input: number[]): Uint32Array {
  let i: number;
  const x: Uint32Array = new Uint32Array(16);
  x.forEach((val, index) => x[index] = input[index]);
  printState(x, 'Estado inicial=\n');

  for (i = 0; i < 20; i += 2) {
    saveArrChange(x, 0, 4, 8, 12);
    saveArrChange(x, 1, 5, 9, 13);
    saveArrChange(x, 2, 6, 10, 14);
    saveArrChange(x, 3, 7, 11, 15);
    saveArrChange(x, 0, 5, 10, 15);
    saveArrChange(x, 1, 6, 11, 12);
    saveArrChange(x, 2, 7, 8, 13);
    saveArrChange(x, 3, 4, 9, 14);
  }

  printState(x, 'Estado final tras las 20 iteraciones=\n');
  const out = new Uint32Array(16);
  for (i = 0; i < 16; i++) {
    out[i] = x[i] + input[i];
  }
  printState(out, 'Estado de salida del generador=\n');
  return out;
};

/**
 * The example of the RFC
 */
const s: number[] = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574,
  0x03020100, 0x07060504, 0x0b0a0908, 0x0f0e0d0c,
  0x13121110, 0x17161514, 0x1b1a1918, 0x1f1e1d1c,
  0x00000001, 0x09000000, 0x4a000000, 0x00000000];

chachaBlock(s);

