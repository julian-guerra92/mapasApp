import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface ColorMarker {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container {
    width: 100%;
    height: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999;
    }

    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 16;
  center: [number, number] = [-75.461709, 6.647192];

  //Arreglo de marcadores
  markers: ColorMarker[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    this.readLocalStorage();
  }

  goMarker(marker: ColorMarker) {
    this.map.flyTo({
      center: marker.marker!.getLngLat()
    });
  }

  addMarker() {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color
    }).setLngLat(this.center).addTo(this.map);

    this.markers.push({
      color,
      marker: newMarker
    });

    this.saveMarkersLocalStorage();
    newMarker.on('dragend', () => {
      this.saveMarkersLocalStorage();
    })
  }

  saveMarkersLocalStorage() {
    const lngLatArr: ColorMarker[] = []
    this.markers.forEach(element => {
      const color = element.color;
      const { lng, lat } = element.marker!.getLngLat();
      lngLatArr.push({
        color: color,
        centro: [lng, lat]
      });
    })
    localStorage.setItem('markers', JSON.stringify(lngLatArr));
  }

  readLocalStorage() {
    if (!localStorage.getItem('markers')) {
      return;
    }
    const lngLatArr: ColorMarker[] = JSON.parse(localStorage.getItem('markers')!);
    lngLatArr.forEach(marker => {
      const newMarker = new mapboxgl.Marker({
        color: marker.color,
        draggable: true
      }).setLngLat(marker.centro!).addTo(this.map);
      this.markers.push({
        marker: newMarker,
        color: marker.color
      });
      newMarker.on('dragend', () => {
        this.saveMarkersLocalStorage();
      })
    });
  }

  borrarMarcador(i: number) {
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);
    this.saveMarkersLocalStorage();
  }

}
