package de.edeka.sw.services.resourcePlanner.backend;

import de.edeka.sw.webapps.resourcePlanner.model.backend.EmployeeDO;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.List;


@RequestScoped
public class EmployeeJpaDAOImpl implements EmployeeDAO {

    private EntityManager entityManager;

    protected EmployeeJpaDAOImpl() {
        // Für CDI benötigt
    }

    @Inject
    EmployeeJpaDAOImpl(final EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<EmployeeDO> getStempel() {

        return entityManager
                .createQuery("SELECT e FROM EmployeeDO s", EmployeeDO.class)
                .getResultList();
    }

    @Override
//    @Transactional
    public void insert(final EmployeeDO stempel) {
        entityManager.persist(stempel);
    }

    @Override
//    @Transactional
    public void update(final EmployeeDO stempel) {
        entityManager.merge(stempel);
    }
}
