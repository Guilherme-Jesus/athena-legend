export type DataName =
  | "atmosphericPressure"
  | "rain"
  | "relativeHumidity"
  | "solarRadiation"
  | "temperature"
  | "windSpeed";

export const dataUnit = {
  atmosphericPressure: " mbar",
  photoPeriod: "h",
  rain: " mm",
  relativeHumidity: "%",
  solarRadiation: " Wh/m²",
  temperature: "°C",
  windSpeed: " km/h",
};

export const displayData = (
  value: number | string | undefined,
  decimals?: number,
  unit?: string
): string => {
  const formattedValue =
    value !== undefined
      ? Number(value)
          .toFixed(decimals || 0)
          .replace(".", ",")
          .replace(",0", "")
      : "--";

  if (unit && value !== undefined) return `${formattedValue}${unit}`;

  return formattedValue;
};

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export const getSvgArc = (
  startAngle: number,
  endAngle: number,
  radius: number,
  x?: number,
  y?: number
): string => {
  const start = polarToCartesian(x || 0, y || 0, radius, endAngle);
  const end = polarToCartesian(x || 0, y || 0, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
};

export const getContrastYIQ = (
  bgColor: string,
  replaceBlackColor?: string,
  replaceWhiteColor?: string
): string => {
  const r = parseInt(bgColor.substring(1, 3), 16);
  const g = parseInt(bgColor.substring(3, 5), 16);
  const b = parseInt(bgColor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? replaceBlackColor || "#000" : replaceWhiteColor || "#fff";
};

export const displayAlertName = (alertType: string): string => {
  switch (alertType) {
    case "rain":
      return "Chuva";
    case "frost":
      return "Geada";
    case "temperature":
      return "Temperatura";
    case "wind":
      return "Vento";
    case "spray":
      return "Janela de pulverização";
  }
  return "";
};
