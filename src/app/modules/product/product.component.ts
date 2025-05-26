import { Component } from '@angular/core';
import { ApiService } from '../../project/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  products: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts() {
    this.products = await this.apiService.getProducts()

  }
}
