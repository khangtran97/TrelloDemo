import { NgModule } from '@angular/core';

import {
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
} from '@angular/material';

@NgModule({
    imports: [
        MatProgressSpinnerModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
    ],
    exports: [
        MatProgressSpinnerModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule
    ]
})

export class MaterialModule {}
