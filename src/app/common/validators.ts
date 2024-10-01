import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOneSkill(control: AbstractControl): ValidationErrors | null {
  const skills = control.value as string[];
  return skills.length > 0 ? null : { atLeastOneSkill: true };
}
export const uniqueNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const persons = control.value as { fullName: string }[];
  const names = persons.map(person => person.fullName);
  const hasDuplicate = names.some((name, index) => names.indexOf(name) !== index);
  return hasDuplicate ? { uniqueName: true } : null;
};
