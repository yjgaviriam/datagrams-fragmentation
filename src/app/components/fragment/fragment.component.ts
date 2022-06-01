import { Component, Input, OnInit } from '@angular/core';
import { CustomNode } from 'src/app/models/node.interface';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-fragment',
  templateUrl: './fragment.component.html',
  styleUrls: ['./fragment.component.sass']
})
export class FragmentComponent implements OnInit {

  public format: string;

  @Input('fragment') public fragment?: any;

  @Input('title') public title?: string;

  private _transformer = (node: CustomNode, level: number) => ({
    expandable: !!node.children && node.children.length > 0,
    name: `${node.key}${node.value}`,
    level: level,
  });

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  public hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor() {
    this.format = 'Binario';
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {
        key: '',
        value: `Internet Protocol Version 4, Src: ${this.fragment.addresses.source}, Dst: ${this.fragment.addresses.destination}`,
        children: [
          {
            key: 'Version: ',
            value: '4'
          },
          {
            key: 'Header Length: ',
            value: '20 bytes (5)'
          },
          {
            key: 'Differentiated Services: ',
            value: 'Default (0)'
          },
          {
            key: 'Total Length: ',
            value: this.fragment.fragmentTotalLength
          },
          {
            key: 'Identification: ',
            value: `0x${(this.fragment.identificationNumber).toString(16)} (${this.fragment.identificationNumber})`
          },
          {
            key: 'Flags',
            value: '',
            children: [
              {
                key: 'Flags',
                value: '',
              }
            ]
          },
          {
            key: 'Time to live: ',
            value: this.fragment.timeToLive
          },
          {
            key: 'Protocol: ',
            value: this.fragment.protocol
          },
          {
            key: 'Source Address: ',
            value: this.fragment.addresses.source
          },
          {
            key: 'Destination Address: ',
            value: this.fragment.addresses.destination
          }
        ],
      }
    ];
  }

}
