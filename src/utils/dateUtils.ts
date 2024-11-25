export const convertBEtoCE = (beDate: string): Date => {
  const [year, month, day] = beDate.split('-').map(Number);
  return new Date(year - 543, month - 1, day);
};

export const calculateAge = (birthDate: Date) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const getCurrentBEDate = () => {
  const today = new Date();
  const beYear = today.getFullYear() + 543;
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${beYear}-${month}-${day}`;
};