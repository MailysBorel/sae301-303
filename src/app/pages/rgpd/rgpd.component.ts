import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'app-rgpd',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './rgpd.component.html',
    styleUrl: './rgpd.component.css'
})
export class RgpdComponent { }
