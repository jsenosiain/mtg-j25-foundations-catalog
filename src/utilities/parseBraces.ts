const parseBraces = (str: string): (string | number)[] => {
  const regex = /\{(.*?)\}/g;

  return Array.from(str.matchAll(regex), (m) => {
    const value = m[1];
    const num = Number(value);

    return !Number.isNaN(num) ? num : value;
  });
};

export default parseBraces;