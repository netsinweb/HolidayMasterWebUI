import { Component, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { HolidayMaster } from './adapter/holiday-master';
import { Holiday } from './model/holiday';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    DatePickerModule,
    TableModule,
    ProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // DI
  holidayApi = inject(HolidayMaster)

  // Field
  tdate: Date = new Date()

  // 読込中状態管理用のSignal
  isLoading = signal<boolean>(false);

  // エラーメッセージ管理用のSignal
  errorMessage = signal<string | null>(null);

  // 1. 検索条件となる「年」をSignalとして定義します（初期値は現在の年）
  private selectedYear = signal<number>(this.tdate.getFullYear());

  // 2. toSignal を使い、selectedYear の変更を検知して自動的に API を叩くように定義します
  holidays = toSignal(
    toObservable(this.selectedYear).pipe(
      switchMap(year => {
        this.isLoading.set(true); // リクエスト開始時に読込中状態にする
        this.errorMessage.set(null); // リクエスト開始時にエラーをクリア
        return this.holidayApi.getHolidays(year).pipe(
          catchError(err => {
            console.error('Data load error.', `status: ${err.status}`)
            this.errorMessage.set('データの取得に失敗しました。後でもう一度お試しください。');
            return of([]); // エラー時は空配列を返してストリームを継続させる
          }),
          finalize(() => this.isLoading.set(false)) // 成功・失敗に関わらず終了時に解除
        );
      })
    ),
    { initialValue: [] as Holiday[] }
  );

  // Method
  selectedHandl = (event:Date) => {
    // 3. ハンドラーでは、検索条件（Signal）を更新するだけで済みます
    this.selectedYear.set(event.getFullYear());
  }
}
