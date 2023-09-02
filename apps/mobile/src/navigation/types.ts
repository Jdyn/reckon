import {DrawerScreenProps} from '@react-navigation/drawer';
import {NavigatorScreenParams} from '@react-navigation/native';

export type LeftDrawerNavParamList = {

}

export type CenterDrawerNavParamList = {

}

export type RightDrawerNavParamList = {

}

export type RootDrawerParamList = {
	LeftDrawer: NavigatorScreenParams<LeftDrawerNavParamList>;
	Root: NavigatorScreenParams<CenterDrawerNavParamList>;
	RightDrawer: NavigatorScreenParams<RightDrawerNavParamList>;
	NotFound: undefined;
	// Modals
	Search: undefined;
};

export type RootDrawerScreenProps<Screen extends keyof RootDrawerParamList> =
	DrawerScreenProps<RootDrawerParamList, Screen>;
