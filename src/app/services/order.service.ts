import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  addOrder(value: Order) {
    return this.http.post<Order>("http://localhost:8080/api/orders/add", value)

  }

  updateOrder(value: Order) {
    return this.http.put<Order>("http://localhost:8080/api/orders/update", value)

  }


  findOrderByid(id: number) {
    return this.http.get<Order>("http://localhost:8080/api/orders/" + id)

  }

  deleteOrderBy(id: number) {
    return this.http.delete("http://localhost:8080/api/orders/delete/" + id)
  }

  getAllOrders() {
    return this.http.get("http://localhost:8080/api/orders/all");
  }

  getAllPaginOrders(pageSize, pageNumber, title = "", isDegital = false) {
    var url = `http://localhost:8080/api/orders/?pageNumber=${pageNumber}&pageSize=${pageSize}&isDegital=${isDegital}&title=${title}`

    return this.http.get<Order[]>(url);
  }
  getAllPaginOrdersByUser(pageSize, pageNumber, userID, title = "", sortAsc = false) {
    var url = `http://localhost:8080/api/orders/?pageNumber=${pageNumber}&pageSize=${pageSize}&title=${title}&userID=${userID}&sortAsc=${sortAsc}`

    return this.http.get<Order[]>(url);
  }

  sumbitServiceToOrder(value){
    var url = `http://localhost:8080/api/orders/addService`

    return this.http.post(url,value,{responseType:'text'});
  }

  removeServiceFromOrder(value){
    var url = `http://localhost:8080/api/orders/removeService`

    return this.http.post(url,value,{responseType:'text'});
  }

}
