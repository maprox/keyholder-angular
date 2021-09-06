import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { Folder, Item } from '../../model';
import { EditFormService } from './edit-form.service';

@Directive({})
export abstract class EditFormComponentDirective implements OnInit {
  @ViewChild('fieldName') fieldName: ElementRef;

  @Input() current: Folder;

  @Output() itemAdd = new EventEmitter<Item>();
  @Output() itemRemove = new EventEmitter<Item>();
  @Output() itemChange = new EventEmitter<Item>();

  isActive = false;

  itemSource: Item;
  itemName: string;

  constructor(
    protected editFormService: EditFormService
  ) {}

  ngOnInit() {
    this.editFormService.getEditEvent().subscribe((item) => {
      if (item === null) {
        this.close();
      } else {
        this.open(item);
      }
    });
  }

  focusName() {
    setTimeout(() => {
      if (this.fieldName?.nativeElement) {
        this.fieldName.nativeElement.focus();
      }
    });
  }

  isEditMode(): boolean {
    return !!this.itemSource;
  }

  open(item: Item) {
    this.itemSource = item;
    this.itemName = item && item.getName() || '';
    this.focusName();
    this.isActive = true;
  }

  close() {
    this.isActive = false;
  }

  add(item: Item) {
    this.current.add(item);
    this.itemAdd.emit(item);
  }

  remove(item: Item) {
    this.current.remove(item);
    this.itemRemove.emit(item);
    this.close();
  }

  change(item: Item) {
    item.setName(this.itemName);
    this.itemChange.emit(item);
  }

  submit() {
    this.close();
  }
}
