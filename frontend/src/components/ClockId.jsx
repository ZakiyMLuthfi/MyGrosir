import React, { useState, useEffect } from "react";

const ClockId = () => {
  const [time, setTime] = useState(getLocalTime());

  useEffect(() => {
    // componenDidMount: Set interval saat komponen pertama kali di-render
    const timerID = setInterval(() => {
      setTime(getLocalTime());
    }, 1000);

    // componentWillUnmount: Clear interval saat komponen dihapus
    return () => clearInterval(timerID);
  }, []); // [] memastikan useEffect hanya dijalankan sekali setelah render pertama kali

  function getLocalTime() {
    const date = new Date(); // Mendapatkan waktu sekarang
    const utcOffset = date.getTimezoneOffset() * 60000; // Menghitung offset dari UTC
    const bangkokTime = new Date(date.getTime() + utcOffset + 7 * 3600000); // Menambahkan 7 jam ke waktu UTC
    return bangkokTime.toLocaleTimeString(); // Mengubah waktu menjadi string format jam
  }

  return (
    <div>
      <h2>{time}</h2>
    </div>
  );
};

export default ClockId;
