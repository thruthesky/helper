import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PostListPage } from '../post-list/post-list';
import { PostEditPage } from '../post-edit/post-edit';
import { PolicyPage } from '../policy/policy';
import { SettingPage } from '../setting/setting';
import { SearchPage } from "../search/search";
import { Xapi } from '../../xmodule/providers/xapi';

export interface PanelMenu {
  title: string;
  component: any;
  icon?:string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  appTitle: string = "Helper App";

  pages: Array<PanelMenu> = [
    { title: 'FORUM',     component: PostListPage, icon : 'chatboxes' },
    { title: 'POST',  component: PostEditPage, icon : 'create' },
    { title: 'POLICY',     component: PolicyPage, icon : 'paper' },
    { title: 'SEARCH',   component: SearchPage, icon : 'search' },
    { title: 'SETTING',   component: SettingPage, icon : 'options' }
  ];
  constructor(public navCtrl: NavController,
    private x: Xapi
  ) {
    x.serverUrl = "http://work.org/wordpress/index.php";
//    setTimeout( () => navCtrl.push( PostEditPage ), 1000 );
//    setTimeout( () => navCtrl.push( PostListPage, {slug: 'housemaid'} ), 1000 );
//    setTimeout( () => navCtrl.push( PostEditPage, {post_ID: 431} ), 1000 );
  }

  openPage( page ) {
    this.navCtrl.push( page.component );
  }


}