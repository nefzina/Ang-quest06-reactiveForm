import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SearchFormModel } from './search-form.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.scss'],
})
export class SearchMovieComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder) {}
  searchForm!: FormGroup;
  searchFormListener!: Subscription;

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchBy: this.fb.group(
        {
          identifier: '',
          title: '',
        },
        { validators: this.isRequiredValidator() }
      ),

      type: ['série'],
      releaseYear: [
        '',
        [
          Validators.required,
          this.rangeDateValidator(1900, new Date().getFullYear()),
        ],
      ],
      sheet: [''], //{value: '', disabled: this.searchForm.get('searchBy')?.get('identifier').invalid}
    });

    this.searchForm.patchValue({ sheet: 'courte' });
    this.searchFormListener = this.searchForm.valueChanges.subscribe((value) =>
      console.log(value)
    );
  }

  onSubmit(): void {
    const model: SearchFormModel = this.searchForm.value;
    console.log(JSON.stringify(model));
  }

  ngOnDestroy(): void {
    this.searchFormListener.unsubscribe();
  }

  // disabled: this.searchForm.get('searchBy')?.get('identifier').invalid

  isRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const id = control.get('identifier')?.value;
      const insertedTitle = control.get('title')?.value;

      if (insertedTitle == '' && id == '') {
        return {
          isRequired:
            "L'un des deux champs 'Identifiant' ou 'Titre' doit être renseigné",
        };
      } else {
        return null;
      }
    };
  }

  rangeDateValidator(minYear: number, maxYear: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // retrieve the control value where the function was called and since there is one value
      // we don't need to use control.get('').value
      const insertedYear = control.value;
      console.log('control.value : ', insertedYear);

      if (insertedYear && (insertedYear < minYear || insertedYear > maxYear))
        return {
          min: "L'année doit être comprise entre " + minYear + ' et ' + maxYear,
        };
      return null;
    };
  }
}
