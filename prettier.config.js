/** @type {import("prettier").Config} */
module.exports = {
  tailwindFunctions: ["cva", "cx", "twMerge"],
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
};
