import React, { useEffect, useState } from 'react';
import './Dashboard.css';

function Dashboard() {
    const [positions, setPositions] = useState([]);
    const [users, setUsers] = useState([]);
    const [display, setDisplay] = useState('users'); // Nouvel état pour suivre l'affichage
    const [message, setMessage] = useState('');

    const [isNewSiteModalOpen, setIsNewSiteModalOpen] = useState(false);

    const openNewSiteModal = () => setIsNewSiteModalOpen(true);
    const closeNewSiteModal = () => setIsNewSiteModalOpen(false);

    useEffect(() => {
        fetch('http://localhost:3001/api/positions')
            .then(response => response.json())
            .then(data => setPositions(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:3001/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleAddSite = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const siteData = Object.fromEntries(formData.entries());

        fetch('http://localhost:3001/api/addSite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(siteData),
        })
            .then(response => {
                if (response.ok) {
                    setMessage('Site ajouté avec succès');
                    event.target.reset(); // Réinitialise le formulaire
                    setTimeout(() => setMessage(''), 5000); // Efface le message après 5 secondes
                } else {
                    throw new Error('Échec de l\'ajout du site');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('Échec de l\'ajout du site');
            });
    };



    const handleEditUser = (userId) => {
        const newAccessRight = prompt('Entrez le nouveau droit d\'accès:');
        if (newAccessRight) {
            fetch(`http://localhost:3001/api/editUser/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessRight: newAccessRight }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    // Mettre à jour l'UI ou afficher un message de succès
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            fetch(`http://localhost:3001/api/deleteUser/${userId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        // Ici, vous pouvez soit rafraîchir la liste des utilisateurs, soit supprimer l'utilisateur de l'état côté client
                        console.log('Utilisateur supprimé avec succès');
                    }
                    return response.json();
                })
                .catch((error) => console.error('Erreur:', error));
        }
    };

    const handleEditSite = (siteId) => {
        // Logique pour modifier un site (afficher un formulaire de modification, par exemple)
    };

    const handleDeleteSite = (siteId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
            fetch(`http://localhost:3001/api/deleteSite/${siteId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        // Ici, vous pouvez soit rafraîchir la liste des sites, soit supprimer le site de l'état côté client
                        console.log('Site supprimé avec succès');
                    } else {
                        throw new Error('La suppression a échoué');
                    }
                })
                .catch((error) => console.error('Erreur:', error));
        }
    };

    const showPositions = () => setDisplay('positions'); // Fonction pour afficher les sites
    const showUsers = () => setDisplay('users'); // Fonction pour afficher les utilisateurs

    return (
        <div name = "dashboard">
            <br/>
            <div className='sidebar'>
                <button className='navbtn' onClick={showPositions}>Gestion Sites</button>
                <button className='navbtn' onClick={showUsers}>Gestion Utilisateurs</button>
            </div>
            <div className='components'>
                {display === 'positions' && (
                    <>
                        <h2>Liste des Sites</h2>
                        <button onClick={openNewSiteModal}>+ Nouveau Lieu</button>
                        <table>
                            <thead>
                            <tr>
                                <th>Nom du Lieu</th>
                                <th>Type</th>
                                <th>Adresse</th>
                                <th>Position</th>
                                <th>Description</th>
                                <th>Site Internet</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {positions.map((position, index) => (
                                <tr key={index}>
                                    <td>{position.nomDuSite}</td>
                                    <td>{position.nomDuType}</td>
                                    <td>{position.adresseComplete}</td>
                                    <td>{position.position}</td>
                                    <td>{position.description}</td>
                                    <td>
                                        
                                        <a href={position.site_internet} target="_blank" rel="noopener noreferrer">
                                            Visiter
                                        </a>
                                        
                                    </td>
                                    <td>
                                        <button className="button-edit"
                                                onClick={() => handleEditSite(position.id)}>Modifier
                                        </button>
                                        <button className="button-delete"
                                                onClick={() => handleDeleteSite(position.id)}>Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
                {display === 'users' && (
                    <>
                        <h2>Liste des Utilisateurs</h2>
                        <table className="table-users">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Pseudo</th>
                                <th>Droit d'accès</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.id}</td>
                                    <td>{user.pseudo}</td>
                                    <td>{user.accessRight}</td>
                                    <td>
                                        <button className="button-edit" onClick={() => handleEditUser(user.id)}>Modifier
                                        </button>
                                        <button className="button-delete" onClick={() => handleDeleteUser(user.id)}>Supprimer
                                        </button>
                                    </td>

                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
            {isNewSiteModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        
                        <form onSubmit={handleAddSite}>
                            <h2>Ajouter un lieu</h2> <br/>
                            {/* ...champs du formulaire... */}
                            <input type="text" name="nom_du_site" placeholder="Nom du Site *" required/>
                            <input type="text" name="nom_du_type" placeholder="Nom du Type"/>
                            <input type="text" name="code_postal" placeholder="Code Postal"/>
                            <input type="text" name="commune" placeholder="Commune"/>
                            <input type="text" name="voie" placeholder="Voie"/>
                            <input type="text" name="adresse_complete" placeholder="Adresse Complète"/>
                            <input type="text" name="latitude" placeholder="Latitude *" required />
                            <input type="text" name="longitude" placeholder="Longitude *" required />
                            <input type="url" name="site_internet" placeholder="Site Internet" />
                            <textarea name="description" placeholder="Description"></textarea>
                            <button type="submit">Ajouter le Site</button>
                            <button type="button" className='cancel-btn' onClick={closeNewSiteModal}>Annuler</button>
                            {message && <div className="message">{message}</div>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
