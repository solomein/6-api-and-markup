define(function (require) {
    'use strict';

    var Bus = require('app/bus'),
        ImagesView = require('app/views/images_view'),
        DetailView = require('app/views/detail_view'),
        NavigationView = require('app/views/navigation_view'),
        Images = require('app/entities/images');

    var imagesCollection = new Images.collection(),
        navigationView = new NavigationView(),
        detailView = new DetailView(),
        imagesView = new ImagesView({
            collection: imagesCollection
        });

    var $activeImage;

    imagesView.on('itemview:thumbnail:click', function (childView) {
        $activeImage && $activeImage.removeClass('image_expanded');
        detailView.close();
        if($activeImage == childView.$el) {
            return $activeImage = undefined;
        }
        $activeImage = childView.$el.append(detailView.render(childView.model).$el);
    });

    detailView.on('prev:click', function(model) {
        imagesView.move(model, 'prev');
    });

    detailView.on('next:click', function(model) {
        imagesView.move(model, 'next');
    });

    detailView.on('close:click', function(model) {
        imagesView.active(model);
    });

    return {
        show: function (type) {
            imagesCollection.fetchBy(type).then(function () {
                Bus.trigger('app:show:mainRegion', imagesView);
                navigationView.active(type);
            });
        },
        start: function () {
            Bus.trigger('app:show:navigationRegion', navigationView);
        },
        redirect: function () {
            Backbone.history.navigate('#/show/top');
        }
    };
});