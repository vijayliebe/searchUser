import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import usersData  from '../users.json'

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  public showSearchDropdown: boolean = false;
  public searchStr: string; // search input stringify
  // User tobe searched from this list
  public userList: any = usersData;
  // search user userList
  public searchedUser: any = [];
  // cached user list
  private cachedResultMap: any = {
    '' : []
  };
  private debounceTimer: any;
  public selectedItemIndex = -1; 

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.selectcard(this.selectedItemIndex, event.key);
  }

  /**
   * This method trigger when something is entered search input
   * searchQuery: string - seach input value
   */
  debouceSearchUser(searchQuery){
   clearTimeout(this.debounceTimer); 
   this.debounceTimer = setTimeout(() => {
     this.seachUser(searchQuery);
   }, 200); 
  }

  seachUser(searchQuery){
    console.log('searchQuery ::', searchQuery);
    this.searchedUser = [];
    // If query is already search return from cache otherwise use userlist
    this.searchedUser = searchQuery in this.cachedResultMap ? this.cachedResultMap[searchQuery] : this.getMatchingUser(searchQuery);
    this.showSearchDropdown = true;
    setTimeout(()=>{
      this.highlight(searchQuery);
    });
  }

  /**
   * This method match seach query with user records and return final userlist * as per search query given
   */
  getMatchingUser(query){
    let searchedUser: any = [];
    const regex = new RegExp(query, 'ig');
    this.userList.forEach((user)=>{
      const idMatch = regex.test(user.id); 
      const nameMatch = regex.test(user.name); 
      const itemsMatch = regex.test(JSON.stringify(user.items)); 
      const addressMatch = regex.test(user.address); 
      const pincodeMatch = regex.test(user.pincode); 

      if(idMatch || nameMatch || itemsMatch || addressMatch || pincodeMatch) {
        searchedUser.push(user);
      }
    });

    console.log('getMatchingUser ::', searchedUser);
    this.cacheSearchResult(query, searchedUser);
    return searchedUser;
  }

  /**
   * This method cached search result
   */
  cacheSearchResult(query, result){
    const cacheMapSize: number = Object.keys(this.cachedResultMap).length;
    if (cacheMapSize > 50) {
      this.cachedResultMap  = Object.keys(this.cachedResultMap).slice(0, 25).map(key => ({[key]:this.cachedResultMap[key]}));
    }
    this.cachedResultMap[query] = result;
  }

  /**
   * select result card logic while navigation(mosue/keyboard)
   */
  selectcard(index, eventName?){
    console.log('selectcard ::', index);
    switch(eventName){
      case 'mouseHover': this.selectedItemIndex = index;
      break;

      case 'mouseHLeave': this.selectedItemIndex = -1;
      break;

      case 'ArrowUp': if(index === 0){
                        this.selectedItemIndex = -1;
                      } else if(index === -1){
                        this.selectedItemIndex = this.searchedUser.length - 1;
                      } else {
                        this.selectedItemIndex = index - 1;
                      }
                      this.scrollIntoView();
                      this.focusSearchInput();
      break;

      case 'ArrowDown': if(index === (this.searchedUser.length - 1)){
                          this.selectedItemIndex = -1;
                        } else if(index === -1){
                          this.selectedItemIndex = 0;
                        } else {
                          this.selectedItemIndex = index + 1;
                        }
                        this.scrollIntoView();
                        this.focusSearchInput();
      break;
    }
  }

  /**
   * on focus out of search box
   */
  blurSearch(){
    return;
    this.showSearchDropdown = false;
    this.selectedItemIndex = -1;
    this.searchedUser = [];
  }

  /**
   * to focus input box
   */
  focusSearchInput(){
    setTimeout(() => {
      this.el.nativeElement.querySelector('#seachUser').focus();
      if(this.selectedItemIndex > -1 && this.searchedUser.length){
        this.searchStr = this.searchedUser[this.selectedItemIndex]['name'];
      } 
    }, 200);
  }

  /**
   * This method scrollIntoview while navigation thorugh arrowkey
   */
  scrollIntoView(){
    this.el.nativeElement.querySelector('#user' + this.selectedItemIndex).scrollIntoView();
  }

  /*
    This method highlight the searched text in result card
  */
  highlight(text) {
    const classList = ['id', 'name', 'items', 'address'];
    classList.forEach((elClass)=>{
      let elList = this.el.nativeElement.querySelectorAll('.' + elClass);

      elList.forEach((inputText)=>{

        let innerHTML = inputText.innerText;
        let index = innerHTML.toLowerCase().indexOf(text.toLowerCase());
        if (index >= 0) { 
          innerHTML = innerHTML.substring(0,index) + "<span class='highlight' style='color: #1400ff;'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
          inputText.innerHTML = innerHTML;
        } else {
          inputText.innerHTML = innerHTML;
        }
      });
    });
  }

}