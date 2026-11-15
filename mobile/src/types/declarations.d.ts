declare namespace React {
  export type FC<P = {}> = (props: P) => any;
  export type ReactNode = any;
  export type ReactElement = any;
}

declare module 'react' {
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export type FC<P = {}> = (props: P) => any;
  export type ReactNode = any;
  export type ReactElement = any;
  const React: any;
  export default React;
}

declare module 'react-native' {
  export const StyleSheet: {
    create: <T extends Record<string, any>>(styles: T) => T;
  };
  export const View: any;
  export const Text: any;
  export const TouchableOpacity: any;
  export const FlatList: any;
  export const Image: any;
  export const TextInput: any;
  export const ScrollView: any;
  export const SafeAreaView: any;
  export const StatusBar: any;
  export const Alert: {
    alert: (title: string, message?: string, buttons?: any[]) => void;
  };
}
