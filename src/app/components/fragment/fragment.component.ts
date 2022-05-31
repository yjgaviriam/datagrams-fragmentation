import { Component, Input, OnInit } from '@angular/core';
import { CustomNode } from 'src/app/models/node.interface';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

const TREE_DATA: CustomNode[] = [
  {
    key: '',
    value: 'Internet Protocol Version 4, Src: 192.168.1.1, Dst: 192.168.1.54',
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
        value: '40'
      },
      {
        key: 'Identification',
        value: '0xe82e (59438)'
      },
      {
        key: 'Flags',
        value: '0xe82e (59438)'
      }
    ],
  }
];

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
    this.dataSource.data = TREE_DATA;
    this.format = 'Binario';
  }

  ngOnInit(): void {
  }

}
