import LocalizedStrings from 'react-localization';
import Env from '../config/env.config';
import UserService from '../services/UserService';

export const strings = new LocalizedStrings({
    fr: {
        DELETE_USER: 'Êtes-vous sûr de vouloir supprimer cet utilisateur et toutes ses données ?',
        DELETE_USERS: 'Êtes-vous sûr de vouloir supprimer les utilisateurs sélectionnés et toutes leurs données ?',
        DELETE_SELECTION: 'Supprimer les utilisateurs sélectionnés',
        BLACKLIST: 'Ajouter à la liste noire'
    },
    en: {
        DELETE_USER: 'Are you sure you want to delete this user and all his data?',
        DELETE_USERS: 'Are you sure you want to delete the selected users and all their data?',
        DELETE_SELECTION: 'Delete selectied users',
        BLACKLIST: 'Add to the blacklist'
    }
});

let language = UserService.getQueryLanguage();

if (language === '' || !Env.LANGUAGES.includes(language)) {
    language = UserService.getLanguage();
}

strings.setLanguage(language);
