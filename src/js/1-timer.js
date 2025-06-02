import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'

const startBtn = document.querySelector("[data-start]");
const dateTimePicker = document.querySelector("#datetime-picker");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");

let selectedTime = null;
let intervalId = null;
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      iziToast.error({
        title: "Hata",
        message: "Lütfen gelecekte bir tarih seçin",
        position: "topRight",
      });
      startBtn.disabled = true;
    } else {
      selectedTime = selectedDates[0];
      startBtn.disabled = false;
    }
  },
};

flatpickr(dateTimePicker, options);

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  dateTimePicker.disabled = true;

  intervalId = setInterval(() => {
    const now = new Date();
    const diff = selectedTime - now;

    if (diff <= 0) {
      clearInterval(intervalId);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const time = convertMs(diff);
    updateTimer(time);
  }, 1000);
});

function updateTimer({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}