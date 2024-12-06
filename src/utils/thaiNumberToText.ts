const units = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const positions = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

export function convertToThaiText(number: number): string {
  if (number === 0) return 'ศูนย์บาทถ้วน';
  
  const decimal = Math.round((number % 1) * 100);
  const integer = Math.floor(number);
  
  let result = '';
  
  // Convert integer part
  const intStr = integer.toString();
  for (let i = 0; i < intStr.length; i++) {
    const digit = parseInt(intStr[i]);
    if (digit !== 0) {
      // Special case for tens
      if (digit === 1 && positions[intStr.length - i - 1] === 'สิบ') {
        result += positions[intStr.length - i - 1];
      } else if (digit === 2 && positions[intStr.length - i - 1] === 'สิบ') {
        result += 'ยี่' + positions[intStr.length - i - 1];
      } else {
        result += units[digit] + positions[intStr.length - i - 1];
      }
    }
  }
  
  result += 'บาท';
  
  // Add satang if exists
  if (decimal > 0) {
    const satangStr = decimal.toString().padStart(2, '0');
    for (let i = 0; i < satangStr.length; i++) {
      const digit = parseInt(satangStr[i]);
      if (digit !== 0) {
        if (i === 0) {
          if (digit === 1) {
            result += 'สิบ';
          } else if (digit === 2) {
            result += 'ยี่สิบ';
          } else {
            result += units[digit] + 'สิบ';
          }
        } else {
          result += units[digit];
        }
      }
    }
    result += 'สตางค์';
  } else {
    result += 'ถ้วน';
  }
  
  return result;
}