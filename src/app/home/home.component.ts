import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AppModule} from "../app.module";
import {fabric} from 'fabric';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {FormsModule} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {MatSliderModule} from "@angular/material/slider";
import {MatButtonModule} from "@angular/material/button";

type drawingMode = 'pencil' | 'erase'

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [AppModule, MatButtonToggleModule, FormsModule, MatSliderModule, MatButtonModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    private canvas: any;
    drawingMode: drawingMode = "pencil"

    private savedLineSetting = {
        "pencil": {
            savedLineWidth: 6,
            savedStroke: '#000000'
        },
        "erase": {
            savedLineWidth: 30, // should set default line width
            savedStroke: '#ffffff'
        }
    };
    lineWidth = new BehaviorSubject<number>(0);
    private stroke = new BehaviorSubject<string>("#000000");
    private drawCursor!: fabric.Circle

    ngOnInit() {
        // canvas 初期化
        this.canvas = new fabric.Canvas('canvas', {
            isDrawingMode: true,
            freeDrawingCursor: 'none',
            backgroundColor: '#ffffff',
        })

        // ブラシカーソル設定
        this.drawCursor = new fabric.Circle({
            radius: this.canvas.freeDrawingBrush.width / 2, // ポインタのサイズ
            fill: this.canvas.freeDrawingBrush.color,
            stroke: '#000000',
            originX: 'center',
            originY: 'center',
            strokeWidth: 1,
            left: 0,
            top: -100,
        });

        this.canvas.add(this.drawCursor);

        // canvasからマウスカーソルが外れたらブラシカーソルを非表示
        this.canvas.on('mouse:out', (options: any) => {
            this.drawCursor.set({left: -100, top: -100}).setCoords().canvas?.renderAll();
        });

        // canvas上をマウスカーソルが移動するとブラシカーソルを追従させる
        this.canvas.on('mouse:move', (options: any) => {
            const mouse = this.canvas.getPointer(options.e)
            this.drawCursor.set({left: mouse.x, top: mouse.y}).bringToFront().setCoords().canvas?.renderAll();
        });

        // 線の太さを変えた際の処理
        this.lineWidth.subscribe((value) => {
            // canvasの線設定を更新
            this.canvas.freeDrawingBrush.width = value
            // カーソルを線設定の太さに合わせる
            this.drawCursor.set({radius: value / 2})

        });
        // 線の色を変えた際の処理
        this.stroke.subscribe((value) => {
            // canvasの線設定を更新
            this.canvas.freeDrawingBrush.color = value
            // カーソルを線設定の色に合わせる
            this.drawCursor.set({fill: value})
        });

        this.restoreLineSetting()
    }

    changeDrawingMode($event: any) {
        this.saveLineSetting()
        this.drawingMode = $event.value
        this.restoreLineSetting()
    }

    changeLineWidth($event: any) {
        this.lineWidth.next($event)
    }

    /**
     * 線の設定を保存する
     */
    saveLineSetting() {
        this.savedLineSetting[this.drawingMode] = {
            savedLineWidth: this.canvas.freeDrawingBrush.width,
            savedStroke: this.canvas.freeDrawingBrush.color
        }
    }

    /**
     * 線の設定を復元する
     */
    restoreLineSetting() {
        this.lineWidth.next(this.savedLineSetting[this.drawingMode].savedLineWidth)
        this.stroke.next(this.savedLineSetting[this.drawingMode].savedStroke)
    }

    /**
     * 画像を保存する
     */
    saveCanvas(){
        const dataURL = this.canvas.toDataURL();
        const blob = this.dataURLToBlob(dataURL);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = new Date().getTime() + ".png";
        link.click();
        URL.revokeObjectURL(link.href);

    }

    /**
     * dataURLをBlobに変換
     * @param dataUrl
     */
    dataURLToBlob(dataUrl: string): Blob {
        const arr = dataUrl.split(',');
        if(arr.length < 1){
            return new Blob();
        }
        const mimes = arr[0].match(/:(.*?);/);
        console.log(mimes)
        const mime = mimes ? mimes[1] : '';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

}
