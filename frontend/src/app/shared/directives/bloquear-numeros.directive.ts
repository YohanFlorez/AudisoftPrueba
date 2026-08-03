import { Directive, HostListener } from '@angular/core';

/**
 * Bloquea el ingreso de dígitos numéricos en un <input>.
 * Reemplaza el método bloquearNumeros($event) repetido en cada componente.
 *
 * Uso:
 *   <input type="text" formControlName="nombre" appBloquearNumeros>
 */
@Directive({
  selector: '[appBloquearNumeros]',
  standalone: true
})
export class BloquearNumerosDirective {
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    if (/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
}
