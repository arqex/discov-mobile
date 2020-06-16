import React, { Component } from 'react';
import { store, actions } from '../state/appState';
import storeService from '../state/store.service';

// Loads the story and its owner from the store or the api
export default function StoryProvider( WrappedComponent ){
	return class extends React.Component<any> {
		story: any = false
		storyListener: any = false

		constructor( props ){
			super( props );
			if( !props.storyId ){
				console.error('Story provider called without a storyId');
			}
			this.loadStory( props.storyId );
		}

		render(){
			return (
				<WrappedComponent
					story={ this.story }
					{ ...this.props } />
			);
		}
		
		loadStory( storyId ){
			this.story = storeService.getStory(storyId);

			if( !this.story ) {
				actions.story.load( storyId )
					.then( () => {
						// Story should be in the store now, load it
						this.loadStory( storyId );
						this.checkListeners();
						this.forceUpdate();
					})
				;
			}
		}

		componentDidMount() {
			this.checkListeners();
		}

		_onChange = () => {
			// check the changes in the story
			this.loadStory( this.props.storyId );
			this.forceUpdate();
		}

		checkListeners() {
			if( this.story && !this.storyListener ){
				this.storyListener = true;
				this.story.on('state', this._onChange );
			}
		}

		componentDidUpdate( prevProps ){
			if( this.props.storyId !== prevProps.storyId ){
				this.story.off('state', this._onChange);
				this.storyListener = false;
				this.loadStory( this.props.storyId );
			}
		}

		componentWillUnmount() {
			if (this.storyListener) {
				this.story.off('state', this._onChange);
			}
		}
	}
}