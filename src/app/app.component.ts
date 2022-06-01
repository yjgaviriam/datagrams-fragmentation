import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilitiesService } from './services/utilities.service';
import { Validators } from '@angular/forms';
import { FragmentService } from './services/fragment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  public form: FormGroup;

  public fragments: any[];

  public protocols: string[];

  constructor(private fb: FormBuilder, private fragmentService: FragmentService, private utilitiesService: UtilitiesService) {
    this.form = this.fb.group({
      mtu: ['', Validators.required],
      datagramLength: ['', Validators.required],
      protocol: ['', Validators.required],
      addresses: this.fb.group({
        destination: ['', Validators.required],
        source: ['', Validators.required]
      }),
    });
    this.fragments = [];
    this.protocols = ['ICMP', 'TCP', 'UDP'];

    this.prueba();

  }

  public prueba(): void {
    const mtu = 1500;
    const datagramLength = 40;
    const protocol = 'TCP';
    const addresses = {
      destination: '192.168.1.13',
      source: '54.148.90.190'
    };

    const identificationNumber = 54234;
    const timeToLive = 213;
    this.fragments = this.fragmentService.buildDatagramHeaders(mtu, datagramLength, protocol, addresses, identificationNumber, timeToLive);

    console.log(this.fragments);

  }

  public generateData(): void {
    const mtu = this.utilitiesService.generateRandomNumber();
    const datagramLength = this.utilitiesService.generateRandomNumber();
    const protocol = this.protocols[this.utilitiesService.generateRandomNumber(0, this.protocols.length)];
    const addresses = {
      destination: `192.${this.utilitiesService.generateRandomNumber(0, 255)}.${this.utilitiesService.generateRandomNumber(0, 255)}.${this.utilitiesService.generateRandomNumber(0, 255)}`,
      source: `192.${this.utilitiesService.generateRandomNumber(0, 255)}.${this.utilitiesService.generateRandomNumber(0, 255)}.${this.utilitiesService.generateRandomNumber(0, 255)}`
    };
    this.form.setValue({ mtu, datagramLength, protocol, addresses });
  }

  public onSubmit(): void {
    const { mtu, datagramLength, protocol, addresses } = this.form.value;
    const identificationNumber = this.utilitiesService.generateRandomNumber(0, 65536);
    const timeToLive = this.utilitiesService.generateRandomNumber(0, 256);
    this.fragments = this.fragmentService.buildDatagramHeaders(mtu, datagramLength, protocol, addresses, identificationNumber, timeToLive);


  }
}
