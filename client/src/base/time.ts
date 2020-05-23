export function toMinutes(x: number) {
  return `${(x / 60).toFixed(2)} min`;
}

function parts(x: number, base: number) {
  const whole = Math.floor(x / base);
  const part = Math.floor(x % base);
  return {
    whole,
    part,
  };
}

function toTwoNumbers(x: number) {
  if (x < 10) return `0${x.toFixed(0)}`;
  return x.toFixed(0);
}

export function toTimeCode(x: number) {
  const { whole: totalMinutes, part: seconds } = parts(x, 60);
  const { whole: hours, part: minutes } = parts(totalMinutes, 60);
  const timeCode = `${toTwoNumbers(minutes)}:${toTwoNumbers(seconds)}`;
  return hours ? `${toTwoNumbers(hours)}:${timeCode}` : timeCode;
}
