import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container {
      width: 100%;
      height: 100%;
    }

    .row {
      background-color: white;
      border-radius: 5%;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      position: fixed;
      z-index: 999;
      width: 400px;
    }
    `
  ]
})

export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  map!: mapboxgl.Map;
  zoomLevel: number = 14;
  center: [number, number] = [-75.461709, 6.647192];

  constructor() { }

  ngOnDestroy(): void {
    this.map.off('zoom', () => { });
    this.map.off('zoomend', () => { });
    this.map.off('move', () => { });
  }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    //Aplicación de Zoom al mapa
    this.map.on('zoom', (event) => {
      const currentZoom = this.map.getZoom();
      this.zoomLevel = currentZoom;
    });

    this.map.on('zoomend', (event) => {
      if (this.map.getZoom() > 18) {
        this.map.zoomTo(18);
      }
    });

    //Movimiento del mapa
    this.map.on('move', (event) => {
      const target = event.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    });

  }

  zoomOut() {
    this.map.zoomOut();
  }

  zoomIn() {
    this.map.zoomIn();
  }

  changeZoom(value: string) {
    this.map.zoomTo(Number(value));
  }

}
