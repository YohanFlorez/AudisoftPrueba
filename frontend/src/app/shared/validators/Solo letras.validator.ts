import { ValidatorFn, Validators } from '@angular/forms';

/**
 * Validador reutilizable: solo permite letras (incluye tildes y ñ) y espacios.
 * Usar en cualquier FormControl que represente un nombre propio.
 *
 * Ejemplo:
 *   nombre: ['', [Validators.required, Validators.maxLength(150), soloLetrasValidator]]
 */
export const SOLO_LETRAS_PATTERN = /^[a-zA-ZÁÉÍÓÚáéíóúÑñÜü\s]+$/;

export const soloLetrasValidator: ValidatorFn = Validators.pattern(SOLO_LETRAS_PATTERN);
