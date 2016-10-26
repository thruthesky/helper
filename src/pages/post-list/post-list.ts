import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Xapi } from "../../xmodule/providers/xapi";
import * as xi from "../../xmodule/interfaces/xapi";
import { PostEditPage } from "../post-edit/post-edit";
import { Language } from "../../providers/language";


@Component({
    selector: 'page-post-list',
    templateUrl: 'post-list.html'
})
export class PostListPage {
    appTitle: string = "Helper List";
    slug: string;
    page: number = 1;
    posts = [];
    moreButton = [];
    constructor(
        public navCtrl: NavController,
        private navParams: NavParams,
        private alertCtrl: AlertController,
        private x: Xapi,
        private language: Language
    ) {
        console.log( 'PostListPage::constructor()', navParams.data);
        this.slug = this.navParams.get( 'slug' );



        this.appTitle = language.get('titlePostList');
        


        this.loadPosts();
    }


    loadPosts( finished? ) {
        let arg : xi.PostQuery = xi.postQuery;
        arg.category_name = this.slug;
        arg.paged = this.page ++;
        arg.per_page = 15;
        this.x.get_posts( arg, (res: xi.PostQueryResponse) => {
                if ( res.success ) {
                    if ( res.data && res.data.length ) {
                        this.displayPosts( res.data );
                    }
                    else {
                        console.log('No more posts');
                    }
                }
                else {
                    if ( res.data ) alert( res.data );
                    else alert("Error on post list");
                }
                if ( finished ) finished();
            },
            e => {
                if ( finished ) finished();
            } );
    }

    displayPosts( data ) {
        console.log( 'success', data );
        for ( let post of data ) {
            if ( post.images ) {
                post.image = post.images[ Object.keys( post.images ).pop() ];
                delete post.images;
            }
            this.posts.push( post );
        }
    }


    doInfinite( infiniteScroll ) {

        this.loadPosts( () => {
            infiniteScroll.complete();
        });

    }


    onClickEdit( post_ID ) {
        this.navCtrl.pop();
        this.navCtrl.push( PostEditPage, { post_ID: post_ID });
    }

    onClickDelete( post_ID, i ) {
        let prompt = this.alertCtrl.create({
            title: 'Delete',
            message: "Enter password of the post",
            inputs: [
                {
                    name: 'password',
                    placeholder: 'Input password'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Delete',
                    handler: data => {
                        console.log('Delete clicked');
                        this.x.delete_post( { post_ID: post_ID, password: data.password }, re => {
                            prompt.dismiss();
                            if ( re.success ) {
                                console.log("PostListPage::onDelete() deleted");
                                this.x.alert("SUCCESS", "Your post has been deleted.");
                                this.posts.splice(i,1);
                            }
                            else {
                                console.log("PostListPage::onDelete() failed to delete");
                                this.x.alert('ERROR', re.data );
                            }
                        }, err => {
                            console.log("server error?..." , err)
                        })
                    }
                }
            ]
        });
        prompt.present();
    }


    ionViewWillEnter() {
        console.log('PostList::ionViewWillEnter')
    }


}
