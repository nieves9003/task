import { AbstractControl, ValidationErrors } from '@angular/forms';

export function atLeastOneSkill(control: AbstractControl): ValidationErrors | null {
  const skills = control.value as string[];
  return skills.length > 0 ? null : { atLeastOneSkill: true };
}
