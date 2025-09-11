import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service'; // adjust path if needed

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="loader-overlay" *ngIf="visible()">
    <div class="loader" [class.dots]="mode()==='dots'"
                        [class.type]="mode()==='type'"
                        [class.wave]="mode()==='wave'">
      <span class="sr-only">Loading</span>

      <!-- dots -->
      <span *ngIf="mode()==='dots'">
        {{ text() }}<b class="dots"><i>.</i><i>.</i><i>.</i></b>
      </span>

      <!-- typewriter -->
      <span *ngIf="mode()==='type'" class="typewrap">
        <b class="type">{{ text() }}</b><em class="caret" aria-hidden="true"></em>
      </span>

      <!-- wave highlight -->
      <span *ngIf="mode()==='wave'" class="wave-text" [attr.data-text]="text()">{{ text() }}</span>
    </div>
  </div>
  `,
  styles: [`
  .loader-overlay{
    position: fixed; inset:0; display:grid; place-items:center;
    background: rgba(15,23,42,.35); backdrop-filter: blur(2px);
    z-index: 9999;
  }
  .loader{ font: 700 20px/1.2 system-ui,Segoe UI,Roboto,Inter,sans-serif; color:#fff; }

  /* --- dots --- */
  .loader.dots .dots{ display:inline-flex; margin-left:.25rem; }
  .loader.dots .dots i{ opacity:0; animation: dot 1.2s infinite; }
  .loader.dots .dots i:nth-child(2){ animation-delay:.2s; }
  .loader.dots .dots i:nth-child(3){ animation-delay:.4s; }
  @keyframes dot{ 0%,20%{opacity:0} 30%,100%{opacity:1} }

  /* --- typewriter --- */
  .typewrap{ position:relative; display:inline-flex; align-items:center }
  .type{ overflow:hidden; white-space:nowrap; display:inline-block;
         border-right: 0 solid transparent; /* prevent layout shift */ }
  .caret{ width:2px; height:1.1em; margin-left:4px; background:#fff; display:inline-block;
          animation: blink .9s steps(2,end) infinite; }
  /* reveal text in steps (width anim). Use CSS var to tune length/time */
  .loader.type .type{
    --chars: 16;              /* adjust to your longest text length */
    width: 0ch;               /* start hidden */
    animation: typing 1.8s steps(var(--chars)) forwards;
  }
  @keyframes typing{ to{ width: var(--chars); } }  /* width in ch units */
  @keyframes blink{ 0%,49%{opacity:1} 50%,100%{opacity:0} }

  /* --- wave highlight --- */
  .wave-text{
    position:relative; display:inline-block; color:#ffffff80;
    background: linear-gradient(90deg,#fff 20%,#ffffff80 40%,#ffffff33 60%,#fff 80%);
    -webkit-background-clip: text; background-clip:text; color:transparent;
    animation: wave 1.6s linear infinite;
  }
  @keyframes wave{ to{ background-position: 200% 0; } }
  .sr-only{ position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; }
  `]
})
export class LoadingOverlayComponent {
  private loading = inject(LoadingService);
  visible = computed(() => this.loading.isVisible());
  text = computed(() => this.loading.text());
  mode = computed(() => this.loading.mode());
}
