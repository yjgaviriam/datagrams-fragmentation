import { Component, Input, OnInit } from '@angular/core';
import { ICustomNode } from 'src/app/models/custom-node.interface';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { IFragment } from '../../models/fragment.interface';

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

  /**
   * Data para el arbol html
   */
   public dataSource: MatTreeFlatDataSource<ICustomNode, {
    expandable: boolean;
    name: string;
    level: number;
  }>;

  /**
   * Tipo de formato a visualizar [Binario, Hexadecimal]
   */
  public format: string;

  /**
   * Contiene la informacion a presentar del fragmento
   */
  @Input('fragment') public fragment?: IFragment;

  /**
   * Control del arbol
   */
   public treeControl: FlatTreeControl<ExampleFlatNode>;

   /**
    * Control del despliegue de hijos en el arbol
    */
   public treeFlattener: MatTreeFlattener<ICustomNode, {
     expandable: boolean;
     name: string;
     level: number;
   }>;

  /**
   * Titulo del componente [Fragmento #x de y]
   */
  @Input('title') public title?: string;

  /**
   * Constructor de la clase
   */
  constructor() {
    this.treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level,
      node => node.expandable,
    );
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      node => node.level,
      node => node.expandable,
      node => node.children,
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.format = 'Binario';
  }

  /**
   * @see [Lifecycle hooks guide](guide/lifecycle-hooks)
   */
  ngOnInit(): void {
    this.dataSource.data = [
      {
        key: '',
        value: `Internet Protocol Version 4, Src: ${this.fragment?.addresses?.source}, Dst: ${this.fragment?.addresses?.destination}`,
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
            value: String(this.fragment?.fragmentTotalLength)
          },
          {
            key: 'Identification: ',
            value: `0x${(Number(this.fragment?.identificationNumber)).toString(16)} (${this.fragment?.identificationNumber})`
          },
          {
            key: 'Flags',
            value: '',
            children: [
              {
                key: `${this.fragment?.fragmentation.substring(0, 1)}... .... = `,
                value: 'Reserved bit: Not set',
              },
              {
                key: `.${this.fragment?.fragmentation.substring(1, 2)}.. .... = `,
                value: `Don't fragment: ${this.fragment?.fragmentation.substring(1, 2) === '0' ? 'Not set' : 'Set'}`,
              },
              {
                key: `..${this.fragment?.fragmentation.substring(2)}. .... = `,
                value: `More fragments: ${this.fragment?.fragmentation.substring(2) === '0' ? 'Not set' : 'Set'}`,
              },
              {
                key: `${(`...${this.fragment?.displacement}`.match(/.{4}/g) || []).join(' ')} = `,
                value: `Fragment Offset: ${parseInt(String(this.fragment?.displacement), 2)}`,
              }
            ]
          },
          {
            key: 'Time to live: ',
            value: String(this.fragment?.timeToLive)
          },
          {
            key: 'Protocol: ',
            value: String(this.fragment?.protocol)
          },
          {
            key: 'Source Address: ',
            value: String(this.fragment?.addresses.source)
          },
          {
            key: 'Destination Address: ',
            value: String(this.fragment?.addresses.destination)
          }
        ],
      }
    ];
  }

  /**
   * Valida si un elemento del arbol tiene hijos para mostrar
   *
   * @param _
   * @param node
   *
   * @returns True si lo tiene, false en caso contrario
   */
  public hasChild(_: number, node: ExampleFlatNode) { return node.expandable };

  /**
   * Transforma la informacion para mostrar en el arbol html
   *
   * @param node Nodo con la informacion
   * @param level Nivel en la estructura del arbol
   *
   * @returns El nuevo objeto
   */
  private transformer(node: ICustomNode, level: number) {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: `${node.key}${node.value}`,
      level: level,
    };
  }
}
