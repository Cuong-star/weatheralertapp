import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { diadiem} from './data';
import { getCityList } from './city';

import { ActionSheetController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  // declare variable:any
  currentDay: any;
  fiveDay: any;
  thongbao: any;
  countries: any;
  cacTinhThanh: any;
  thongTinThoiTietTrong5Ngay: any;
  oneCallUvi: any;
  airPol: any;

  // declare variables:string
  name: string;
  maunen: string = 'gray';
  uv_notification: string = '';
  airpl_notification: string = '';

  // declare varaibles:object
  coordinate: { lat: number; lon: number };
  _____: {
    icon: string;
    status: string;
    temp: { max: number; min: number };
  }[];
  excludeOneCall: {
    current: Boolean;
    daily: Boolean;
    hourly: Boolean;
    minutely: Boolean;
    alerts: Boolean;
  };

  calling: Boolean = false;
  constructor(
    private weatherService: WeatherService,
    private alertCtrl: AlertController
  ) {
    this.countries = getCityList();
    let cityIndex = 55; // Thành phó quảng ngãi
    let data = this.getDataCity(cityIndex);
    let coord = data.coord;

    this.coordinate = coord;
    this.cacTinhThanh = diadiem;
    this.excludeOneCall = {
      current: true,
      minutely: true,
      hourly: true,
      daily: true,
      alerts: false,
    };

    let currentDayService = this.weatherService.readF(
      this.coordinate.lat,
      this.coordinate.lon
    );
    let fiveDayService = this.weatherService.read5day(
      this.coordinate.lat,
      this.coordinate.lon
    );

    let oneCallService = this.weatherService.onecall(
      this.coordinate.lat,
      this.coordinate.lon,
      this.excludeOneCall
    );

    let airPlService = this.weatherService.airPl(
      this.coordinate.lat,
      this.coordinate.lon
    );

    this.get5DayData(fiveDayService);
    this.getData(currentDayService);
    this.getOneCall(oneCallService);
    this.getairPl(airPlService);
  }

  async searchCity(key = '') {
    let self = this;

    async function subSearchCity() {
      let alert = await self.alertCtrl.create({
        header: 'Lọc địa điểm',
        inputs: [
          {
            name: 'location',
            type: 'text',
            placeholder: 'Nhập từ để lọc',
          },
        ],
        buttons: [
          {
            text: 'Hủy bỏ',
            handler: () => {
              console.log('Canceled');
              self.searchCity();
            },
          },
          {
            text: 'Lọc',
            handler: (input) => {
              if (typeof input !== null) {
                self.searchCity(input.location);
              }
            },
          },
        ],
      });
      await alert.present();
    }

    let diaDiemInput = [];
    if (key === '') {
      for (let i of diadiem) {
        let obj = {
          text: i,
          type: 'radio',
          label: i,
          value: i,
          checked: false,
        };
        diaDiemInput.push(obj);
      }
    } else {
      for (let i of diadiem) {
        let lower = i.toLowerCase();
        if (this.change_alias(lower).includes(this.change_alias(key))) {
          let obj = {
            name: 'loc',
            text: i,
            type: 'radio',
            label: i,
            value: i,
            checked: false,
          };
          diaDiemInput.push(obj);
        }
      }
    }

    if (diaDiemInput.length !== 0) diaDiemInput[0].checked = true;
    let events = [
      {
        text: 'Quay lại từ đầu',
        handler: () => self.searchCity(),
      },
      {
        text: 'Tìm kiếm',
        handler: () => subSearchCity(),
      },
      {
        text: 'Ok',
        handler: (input) => {
          self.onChange(input);
        },
      },
    ];
    let alert = await this.alertCtrl.create({
      header: 'Địa điểm',
      inputs: diaDiemInput,
      buttons: events,
    });
    alert.present();
  }

  private change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ|ð/g, 'd');
    str = str.trim();
    return str;
  }

  private convertEncodeUTF8(name, arr = this.cacTinhThanh) {
    for (let i of arr) {
      if (this.change_alias(i) === name.toLowerCase()) return i;
    }
    return name;
  }

  getDataCity(index: number) {
    this.countries = getCityList();
    return this.countries[index];
  }

  // get 5 day data
  async get5DayData(WeaService) {
    function xuLyNgayThangNamGio(datetime) {
      let dataset = datetime.split(' ');
      let date = dataset[0];
      let time = dataset[1];

      function reverse(date) {
        let array = date.split('-');
        return `${array[2]}/${array[1]}/${array[0]}`;
      }

      function getHourAndMinute(time) {
        let array = time.split(':');
        let hour = array[0];
        let minute = array[1];
        return `${hour}:${minute}`;
      }

      return {
        date: reverse(date),
        time: getHourAndMinute(time),
      };
    }

    function xuLyNhietDo(temp: number) {
      let kelvin_number = 273.15;
      return Math.ceil(temp - kelvin_number);
    }
    await WeaService.subscribe((data) => {
      this.fiveDay = data;

      for (let i = 0; i < this.fiveDay.list.length; i++) {
        let data = this.fiveDay.list[i];
        data.date_and_time = xuLyNgayThangNamGio(data.dt_txt);
        data.main.re_temp = xuLyNhietDo(data.main.temp);
        data.weather[0].path_icon =
          'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png';
      }
    });
  }

  // currentDay
  async getData(WeaService) {
    await WeaService.subscribe((data) => {
      this.currentDay = data;
      //console.log(this.currentDay);
      this.currentDay.name = this.convertEncodeUTF8(this.currentDay['name']);
      this.currentDay.name = this.currentDay.name.replace(/gj/g, 'đ');
      this.currentDay.name = this.currentDay.name.replace(/GJ/g, 'Đ');

      let temp = this.currentDay.main.temp;
      let kelvin_number = 273.15;
      this.currentDay.main.temp = Math.ceil(temp - kelvin_number);
    });
  }

  // ĐK đo UV

  async getOneCall(service) {
    function uv_process(uv_value): string {
      let condition = {
        0: 'Gây tổn thương cho da mức thấp.',
        1: 'Gây tổn thương cho da mức trung bình. Cần có những biện pháp phòng ngừa bỏng da.',
        2: 'Gây tổn thương da mức cao. Giảm thời gian ở ngoài nắng khoảng thời gian 10 giờ đến 16 giờ, thoa kem chống nắng SPF 30+, đội nón, mặc quần áo chống nắng.',
        3: 'Gây tổn thương cho da mức rất cao. Không nên ra ngoài nhiều nếu không cần thiết. Nếu ra ngoài phải thực hiện đầy đủ các biện phòng ngừa bảo vệ da và mắt.',
      };

      let uv_level =
        0 > uv_value
          ? -1
          : 0 <= uv_value && uv_value <= 2
          ? 0
          : 3 <= uv_value && uv_value <= 5
          ? 1
          : 6 <= uv_value && uv_value <= 7
          ? 2
          : 3;

      if (uv_level == -1) return 'undefined';
      return condition[uv_level];
    }
    await service.subscribe((data) => {
      // data of one call
      this.oneCallUvi = data.current.uvi;
      this.uv_notification = uv_process(this.oneCallUvi);
    });
  }

  //current air pollution
  async getairPl(WeaService) {
    // Xét điều kiện
    function air_pollution(airpl_value): string {
      let condition = {
        1: 'Mức tốt. Không ảnh hưởng đến sức khỏe.',
        2: 'Mức khá. Chấp nhận được. Người nhạy cảm nên hạn chế thời gian ra ngoài ',
        3: 'Mức trung bình. Ảnh hưởng đến sức khỏe, nên mang khẩu trang khi ra đường',
        4: 'Mức kém. Ảnh hưởng xấu đến sức khỏe. Cân nhắc các hoạt đông ngoài trời và mang khẩu trang.',
        5: 'Mức rất kém. Ảnh hưởng nghiêm trọng đến sức khỏe mọi người, không nên ra ngoài nhiều. Phải mang khẩu trang khi ra ngoài',
      };

      let airpl_level =
        0 == airpl_value
          ? 0
          : airpl_value == 1
          ? 1
          : airpl_value == 2
          ? 2
          : airpl_value == 3
          ? 3
          : airpl_value == 4
          ? 4
          : 5;

      if (airpl_level == 0) return 'undefined';
      return condition[airpl_level];
    }

    await WeaService.subscribe((data) => {
      this.airPol = data.list[0].main.aqi;
      this.airpl_notification = air_pollution(this.airPol);
    });
  }

  closeAlert() {
    let alertBox = document.getElementsByClassName('alert-box')[0];
    let classname = alertBox.className;

    if (this.calling == true) {
      classname = classname.replace('calling', 'nocalling');
      alertBox.setAttribute('class', classname);
      this.calling = false;
    }
  }

  onChange(value) {
    if (value == undefined) {
      this.searchCity();
      return;
    }

    for (let i of this.countries) {
      let name = i.name;
      let a = this.change_alias(name);
      let b = this.change_alias(value);
      //console.log(a, b, a.toLowerCase().includes(b.toLowerCase()));
      if (a.toLowerCase().includes(b.toLowerCase())) {
        let lat = i.coord.lat;
        let lon = i.coord.lon;
        //console.log(lat, lon);
        let oneCallService = this.weatherService.onecall(
          this.coordinate.lat,
          this.coordinate.lon,
          this.excludeOneCall
        );
        let currentDayService = this.weatherService.readF(lat, lon);
        let fiveDayService = this.weatherService.read5day(lat, lon);
        let airPlService = this.weatherService.airPl(
          this.coordinate.lat,
          this.coordinate.lon
        );
        this.get5DayData(fiveDayService);
        this.getData(currentDayService);
        this.getOneCall(oneCallService);
        this.getairPl(airPlService);
        break;
      }
    }
  }
}

