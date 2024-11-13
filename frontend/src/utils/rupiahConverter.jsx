const formatToRupiah = (number) => {
  if (typeof number !== "number" && typeof number !== "string") {
    return "Rp 0"; // Mengembalikan default jika input bukan angka atau string yang valid
  }

  const formattedNumber = Math.floor(parseFloat(number)); // Menghilangkan desimal dengan pembulatan ke bawah
  return `Rp ${formattedNumber
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
};

export default formatToRupiah;
