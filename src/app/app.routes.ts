import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductComponent } from './pages/product/product.component';

export const routes: Routes = [ 
    { path: '', component: HomeComponent }, // Page d'accueil
    { path: 'login', component: LoginComponent }, // Page de connexion
    { path: 'register', component: RegisterComponent }, // Page d'inscription
    { path: 'cart', component: CartComponent }// Page du panier
    ,{ path: 'product/:id', component: ProductComponent }// Page de détail du produit
];
