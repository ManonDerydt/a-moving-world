import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
  mode?: 'vote' | 'waitlist';
  message?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
                                                      isOpen,
                                                      onClose,
                                                      onSuccess,
                                                      mode = 'vote',
                                                      message
                                                    }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userCredential;

      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Ajout dans Firestore
        const userRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userRef, {
          firstName,
          lastName,
          email,
          createdAt: new Date(),
        });

        console.log("✅ Utilisateur ajouté à Firestore !");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      onSuccess({
        uid: userCredential.user.uid,
        firstName,
        lastName,
        email,
      });

      onClose();
    } catch (err: any) {
      console.error('❌ Erreur d\'authentification:', err);
      let errorMessage = 'Une erreur est survenue';

      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-email':
            errorMessage = 'Adresse email invalide';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Ce compte a été désactivé';
            break;
          case 'auth/user-not-found':
            errorMessage = 'Aucun compte trouvé avec cette adresse email';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Mot de passe incorrect';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'Cette adresse email est déjà utilisée';
            break;
          case 'auth/weak-password':
            errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
            break;
          default:
            errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-2">
              {isSignUp ? 'Créer un compte' : 'Se connecter'}
            </DialogTitle>
            {message && (
                <DialogDescription className="text-center text-amber-600 flex items-center justify-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {message}
                </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Jean"
                        required
                        disabled={loading}
                        className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Dupont"
                        required
                        disabled={loading}
                        className="w-full"
                    />
                  </div>
                </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                  className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full"
                  minLength={6}
              />
            </div>

            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
                type="submit"
                className="w-full bg-[#5394b7]"
                disabled={loading}
            >
              {loading ? (
                  'Chargement...'
              ) : (
                  isSignUp ? 'Créer un compte' : 'Se connecter'
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
              <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-1 text-[#242565] hover:underline"
                  disabled={loading}
              >
                {isSignUp ? 'Se connecter' : 'Créer un compte'}
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>
  );
};
