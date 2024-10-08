export const ConvertToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const formatPrice = (price: any, locale = "en-IN", currency = "INR") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // Show no decimal places if there are none
    maximumFractionDigits: 2, // Show up to two decimal places if they exist
  }).format(price);
};

export function groupProducts(products: any[], field: string) {
  const groupedProducts: any = {};

  products.forEach((product: any) => {
    const key = product[field] || "Other"; // Default category for undefined fields
    if (!groupedProducts[key]) {
      groupedProducts[key] = [];
    }
    groupedProducts[key].push(product);
  });

  return groupedProducts;
}
export const find30percent = (price: any) => {
  return (30 / 100) * price;
};

export const find70percent = (price: any) => {
  return (70 / 100) * price;
};
export const find5percent = (price: any) => {
  return (5 / 100) * price;
};
export const formatRelativeTime = (isoString: string) => {
  const now = new Date();
  const past = new Date(isoString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];

  let diff = diffInSeconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";

  for (const [amount, currentUnit] of intervals) {
    if (diff < amount) {
      unit = currentUnit;
      break;
    }
    diff /= amount;
  }

  diff = Math.floor(diff);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  return rtf.format(-diff, unit);
};
