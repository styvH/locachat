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

    const [isEditSiteModalOpen, setIsEditSiteModalOpen] = useState(false);
    const [currentSite, setCurrentSite] = useState(null);


    const openEditSiteModal = (siteId) => {
        // Appel API pour récupérer les données du site
        fetch(`http://localhost:3001/api/editSite/${siteId}`)
            .then(response => response.json())
            .then(data => {
                setCurrentSite(data); // Stockez les données du site dans l'état
                setIsEditSiteModalOpen(true); // Ouvrez le modal de modification
            })
            .catch(error => console.error('Error fetching site details:', error));
    };

    const handleEditSite = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedSiteData = Object.fromEntries(formData.entries());

        // Ici, vous devez avoir l'ID du site que vous modifiez
        const siteId = currentSite.id;

        fetch(`http://localhost:3001/api/editSite/${siteId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSiteData),
        })
            .then(response => {
                if (response.ok) {
                    // Traitez la réponse, fermez le modal et mettez à jour l'état des sites si nécessaire
                } else {
                    throw new Error('Échec de la modification du site');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const closeEditSiteModal = () => {
        setCurrentSite(null);
        setIsEditSiteModalOpen(false);
    };

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

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [sitesPerPage, setSitesPerPage] = useState(5); // par exemple, 10 sites par page

    // Fonction pour calculer le nombre total de pages
    const pageCount = Math.ceil(positions.length / sitesPerPage);

    // Fonction pour changer la page
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculer les indices des sites pour la page actuelle
    const indexOfLastSite = currentPage * sitesPerPage;
    const indexOfFirstSite = indexOfLastSite - sitesPerPage;
    const currentSites = positions.slice(indexOfFirstSite, indexOfLastSite);

    // Rendre les contrôles de pagination
    const renderPageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1).map(number => {
        return (
            <button key={number} onClick={() => goToPage(number)} disabled={currentPage === number}>
                {number}
            </button>
        );
    });


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
                        
                        <button onClick={openNewSiteModal}>+ Nouveau Lieu</button> <span className='totalsites'>(total : {positions.length} sites)</span>
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
                            {currentSites.map((position, index) => (
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
                                                onClick={() => openEditSiteModal(position.id)}>Modifier
                                        </button>
                                        <button className="button-delete"
                                                onClick={() => handleDeleteSite(position.id)}>Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            {renderPageNumbers}
                        </div>
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
            {isEditSiteModalOpen && currentSite && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h2>Modifier un lieu</h2>
                        <form onSubmit={handleEditSite}>
                        <h2>Ajouter un lieu</h2> <br/>
                            {/* ...champs du formulaire... */}
                            <input type="text" name="nom_du_site" placeholder="Nom du Site *" value={currentSite.nom_du_site || ''} required/>
                            <input type="text" name="nom_du_type" placeholder="Nom du Type" value={currentSite.nom_du_type || ''} />
                            <input type="text" name="code_postal" placeholder="Code Postal" value={currentSite.code_postal || ''} />
                            <input type="text" name="commune" placeholder="Commune" value={currentSite.commune || ''} />
                            <input type="text" name="voie" placeholder="Voie" value={currentSite.voie || ''} />
                            <input type="text" name="adresse_complete" placeholder="Adresse Complète" value={currentSite.adresse_complete || ''} />
                            <input type="text" name="latitude" placeholder="Latitude *" value={currentSite.latitude || ''} required />
                            <input type="text" name="longitude" placeholder="Longitude *" value={currentSite.longitude || ''} required />
                            <input type="url" name="site_internet" placeholder="Site Internet" value={currentSite.site_internet || ''} />
                            <textarea name="description" placeholder="Description" value={currentSite.description || ''}></textarea>
                            <button type="submit">Modifier le Site</button>
                            <button type="button" className='cancel-btn' onClick={closeEditSiteModal}>Annuler</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
