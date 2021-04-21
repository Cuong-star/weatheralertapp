import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  apikey: string;
  json: any;

  constructor(public http: Http, public https: HttpClient) {
    this.apikey = '63f467e3349d56232a288778f4f04c1e';
  }

  // https://openweathermap.org/data/2.5/weather?lat=108&lon=15&appid=439d4b804bc8187953eb36d2a8c26a02
  readF(lat, lon) {
    let path = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apikey}&lang=vi`;
    return this.http.get(path).pipe(map((docs) => docs.json()));
  }

  read5day(lat, lon) {
    let path = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apikey}`;
    return this.http.get(path).pipe(map((docs) => docs.json()));
  }
  


  onecall(lat, lon, exclude:{
    "current":Boolean, 
    "minutely":Boolean,
    "hourly":Boolean,
    "daily":Boolean,
    "alerts":Boolean}) {
    let options = [];
    let keys = Object.keys(exclude);
    for(let key of keys) {
      if(exclude[key] == false) {
        options.push(key);
      }
    }

    let excludeOption = options.join(',');
    let path = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${excludeOption}&appid=${this.apikey}&units=metric`;
    return this.http.get(path).pipe(map((docs) => docs.json()));
  }

  airPl(lat, lon){
    let path = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apikey}`;
    return this.http.get(path).pipe(map((docs) => docs.json()));
  }
}
