// Pre-compiled regex patterns
const REGEX_PATTERNS = {
  nullable: /./,
  anything: /.+/,
  name: /^[A-Za-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÍÌỈĨỊÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ\s]+$/,
  // eslint-disable-next-line no-useless-escape
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  phone: /^\d{10,11}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  id_card: /(^\d{9}$|^\d{12}$)/,
  address: /^[^]+$/,
  bio: /.+/,
  level: /^(?=.*[a-zA-Z])[A-Za-z\d\s_'-]*$/
}

export const regexTest = (name, value) => {
  if (!name || value === undefined) return false
  const pattern = REGEX_PATTERNS[name]
  return pattern ? pattern.test(value) : false
}

export const numberTest = (name, value) => {
  if (!name || value === '') return false

  const num = typeof value === 'string' ? Number(value) : value
  if (isNaN(num)) return false

  const checks = {
    greaterThanOrEqualTo: () => num >= 0,
    positive: () => num > 0,
    negative: () => num < 0,
    zero: () => num === 0,
    zeroTo100: () => num >= 0 && num <= 100,
    oneTo5: () => num >= 1 && num <= 5
  }

  return name.includes('|')
    ? name.split('|').some((n) => checks[n]?.())
    : checks[name]?.() || false
}
